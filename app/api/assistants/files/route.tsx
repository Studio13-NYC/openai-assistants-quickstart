import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface ErrorResponse {
  error: string;
}

// upload file to assistant's vector store
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No valid file provided' }, { status: 400 });
    }

    const vectorStoreId = await getOrCreateVectorStore();

    // upload using the file stream
    const openaiFile = await openai.files.create({
      file: file,
      purpose: "assistants",
    });

    // add file to vector store
    await openai.beta.vectorStores.files.create(vectorStoreId, {
      file_id: openaiFile.id,
    });
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// list files in assistant's vector store
export async function GET() {
  try {
    const vectorStoreId = await getOrCreateVectorStore();
    const fileList = await openai.beta.vectorStores.files.list(vectorStoreId);

    const filesArray = await Promise.all(
      fileList.data.map(async (file) => {
        const fileDetails = await openai.files.retrieve(file.id);
        const vectorFileDetails = await openai.beta.vectorStores.files.retrieve(
          vectorStoreId,
          file.id
        );
        return {
          file_id: file.id,
          filename: fileDetails.filename,
          status: vectorFileDetails.status,
        };
      })
    );
    return NextResponse.json(filesArray);
  } catch (error: unknown) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

// delete file from assistant's vector store
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const fileId = body.fileId;
    if (!fileId) {
      return NextResponse.json({ error: 'No file ID provided' }, { status: 400 });
    }

    const vectorStoreId = await getOrCreateVectorStore();
    await openai.beta.vectorStores.files.del(vectorStoreId, fileId);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete file' },
      { status: 500 }
    );
  }
}

/* Helper functions */

const getOrCreateVectorStore = async (): Promise<string> => {
  try {
    const assistant = await openai.beta.assistants.retrieve(assistantId);

    // if the assistant already has a vector store, return it
    const vectorStoreIds = assistant.tool_resources?.file_search?.vector_store_ids;
    if (vectorStoreIds && vectorStoreIds.length > 0) {
      return vectorStoreIds[0];
    }

    // otherwise, create a new vector store and attach it to the assistant
    const vectorStore = await openai.beta.vectorStores.create({
      name: "sample-assistant-vector-store",
    });

    await openai.beta.assistants.update(assistantId, {
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    });

    return vectorStore.id;
  } catch (error: unknown) {
    console.error('Error with vector store:', error);
    throw new Error('Failed to get or create vector store');
  }
};
