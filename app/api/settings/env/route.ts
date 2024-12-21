import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = await fs.readFile(envPath, 'utf-8');
    
    // Parse the .env file
    const envVars = envContent
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .reduce((acc, line) => {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        acc[key.trim()] = value;
        return acc;
      }, {} as Record<string, string>);

    return NextResponse.json(envVars);
  } catch (error) {
    console.error('Error reading environment variables:', error);
    return NextResponse.json(
      { error: 'Failed to read environment variables' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    
    // Read the current .env file
    const envPath = path.join(process.cwd(), '.env');
    const envContent = await fs.readFile(envPath, 'utf-8');
    
    // Split into lines and update the matching line
    const lines = envContent.split('\n');
    const updatedLines = lines.map(line => {
      if (line.startsWith(`${key}=`) || line.startsWith(`${key} =`)) {
        return `${key}="${value}"`;
      }
      return line;
    });
    
    // Write back to the file
    await fs.writeFile(envPath, updatedLines.join('\n'));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating environment variable:', error);
    return NextResponse.json(
      { error: 'Failed to update environment variable' },
      { status: 500 }
    );
  }
} 