"use client";

import React, { useState, useEffect } from "react";
import styles from "./file-viewer.module.css";

interface FileData {
  file_id: string;
  filename: string;
  status: string;
}

const TrashIcon = () => (
  <svg
    width="14"
    height="16"
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.trashIcon}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.66634 1.33333C5.66634 0.596954 6.26329 0 6.99967 0H6.99967C7.73605 0 8.33301 0.596954 8.33301 1.33333V2H5.66634V1.33333ZM4.33301 2V1.33333C4.33301 -0.124349 5.54199 -1.33333 6.99967 -1.33333H6.99967C8.45735 -1.33333 9.66634 -0.124349 9.66634 1.33333V2H12.6663C13.0345 2 13.333 2.29848 13.333 2.66667C13.333 3.03486 13.0345 3.33333 12.6663 3.33333H11.9997V13.3333C11.9997 14.8027 10.8023 16 9.33301 16H4.66634C3.19700 16 1.99967 14.8027 1.99967 13.3333V3.33333H1.33301C0.964815 3.33333 0.666341 3.03486 0.666341 2.66667C0.666341 2.29848 0.964815 2 1.33301 2H4.33301ZM3.33301 3.33333V13.3333C3.33301 14.0697 3.92996 14.6667 4.66634 14.6667H9.33301C10.0694 14.6667 10.6663 14.0697 10.6663 13.3333V3.33333H3.33301ZM5.66634 6C5.66634 5.63181 5.36786 5.33333 4.99967 5.33333C4.63148 5.33333 4.33301 5.63181 4.33301 6V12C4.33301 12.3682 4.63148 12.6667 4.99967 12.6667C5.36786 12.6667 5.66634 12.3682 5.66634 12V6ZM8.99967 5.33333C9.36786 5.33333 9.66634 5.63181 9.66634 6V12C9.66634 12.3682 9.36786 12.6667 8.99967 12.6667C8.63148 12.6667 8.33301 12.3682 8.33301 12V6C8.33301 5.63181 8.63148 5.33333 8.99967 5.33333Z"
      fill="#666666"
    />
  </svg>
);

const FileViewer = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchFiles = async () => {
    try {
      const resp = await fetch("/api/assistants/files", {
        method: "GET",
      });
      if (!resp.ok) {
        const errorData = await resp.text();
        throw new Error(errorData || 'Failed to fetch files');
      }
      const data = await resp.json() as FileData[];
      setFiles(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      const resp = await fetch("/api/assistants/files", {
        method: "DELETE",
        body: JSON.stringify({ fileId }),
      });
      if (!resp.ok) throw new Error('Failed to delete file');
      // Optimistically remove the file from the list
      setFiles(files => files.filter(f => f.file_id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const data = new FormData();
      if (!event.target.files || event.target.files.length === 0) return;
      data.append("file", event.target.files[0]);
      const resp = await fetch("/api/assistants/files", {
        method: "POST",
        body: data,
      });
      if (!resp.ok) throw new Error('Failed to upload file');
      // Trigger an immediate fetch to show the new file
      fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className={styles.fileViewer}>
      <div
        className={`${styles.filesList} ${
          files.length !== 0 ? styles.grow : ""
        }`}
      >
        {loading ? (
          <div className={styles.message}>Loading files...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : files.length === 0 ? (
          <div className={styles.title}>Attach files to test file search</div>
        ) : (
          files.map((file) => (
            <div key={file.file_id} className={styles.fileEntry}>
              <div className={styles.fileName}>
                <span className={styles.fileName}>{file.filename}</span>
                <span className={styles.fileStatus}>{file.status}</span>
              </div>
              <span onClick={() => handleFileDelete(file.file_id)}>
                <TrashIcon />
              </span>
            </div>
          ))
        )}
      </div>
      <div className={styles.fileUploadContainer}>
        <label htmlFor="file-upload" className={styles.fileUploadBtn}>
          Attach files
        </label>
        <input
          type="file"
          id="file-upload"
          name="file-upload"
          className={styles.fileUploadInput}
          onChange={handleFileUpload}
          accept=".txt,.md,.pdf"
        />
      </div>
    </div>
  );
};

export default FileViewer;
