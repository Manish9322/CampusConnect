import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'document';

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const filename = `${timestamp}_${originalName}`;

    // Determine upload path based on type
    let uploadPath = '';
    switch (type) {
      case 'assignment':
        uploadPath = 'assignments';
        break;
      case 'profile':
        uploadPath = 'profiles';
        break;
      case 'announcement':
        uploadPath = 'announcements';
        break;
      default:
        uploadPath = 'documents';
    }

    // Create upload directory path
    const publicDir = join(process.cwd(), 'public', 'uploads', uploadPath);
    
    // Ensure directory exists
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    // Write file to disk
    const filePath = join(publicDir, filename);
    await writeFile(filePath, buffer);

    // Return the relative URL path
    const fileUrl = `/uploads/${uploadPath}/${filename}`;

    return NextResponse.json(
      { 
        message: 'File uploaded successfully',
        fileUrl,
        filename,
        size: file.size,
        type: file.type
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'Error uploading file', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Configure body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
