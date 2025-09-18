import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import agentModel, { getOrCreateAgent } from '@/app/lib/agentModel';
import connectDB from '../db';

// Type guard to check if an object is a file-like object
function isFileLike(obj: any): obj is { arrayBuffer: () => Promise<ArrayBuffer>; name: string; type: string; size: number } {
  return (
    obj &&
    typeof obj.arrayBuffer === 'function' &&
    typeof obj.name === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.size === 'number'
  );
}

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse form data from the request
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const aiAgentName = formData.get('aiAgentName') as string;
    const agentDescription = formData.get('agentDescription') as string;
    const domainExpertise = formData.get('domainExpertise') as string;
    const colorTheme = formData.get('colorTheme') as string;

    const logoFile = formData.get('logoFile');
    const bannerFile = formData.get('bannerFile');
    const logoFileUrl = formData.get('logoFileUrl') as string | null;
    const bannerFileUrl = formData.get('bannerFileUrl') as string | null;

    // Log incoming data for debugging
    console.log({
      userId,
      aiAgentName,
      agentDescription,
      domainExpertise,
      colorTheme,
      logoFile: logoFile ? 'File received' : 'No file',
      bannerFile: bannerFile ? 'File received' : 'No file',
      logoFileUrl,
      bannerFileUrl,
    }, 'Data from request');

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }
    if (!aiAgentName || !agentDescription || !domainExpertise) {
      return NextResponse.json(
        { success: false, message: 'Name, description, and expertise are required' },
        { status: 400 }
      );
    }
    if (!logoFile && !logoFileUrl) {
      return NextResponse.json(
        { success: false, message: 'Logo file or URL is required' },
        { status: 400 }
      );
    }

    // Validate file sizes
    if (isFileLike(logoFile) && logoFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Logo file size exceeds 5MB' },
        { status: 400 }
      );
    }
    if (isFileLike(bannerFile) && bannerFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Banner file size exceeds 10MB' },
        { status: 400 }
      );
    }

    // Validate file types
    if (isFileLike(logoFile) && !logoFile.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Logo must be an image file' },
        { status: 400 }
      );
    }
    if (isFileLike(bannerFile) && !bannerFile.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Banner must be an image file' },
        { status: 400 }
      );
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to create upload directory' },
        { status: 500 }
      );
    }

    const savedFiles: { logo?: string; banner?: string } = {};

    // Save logo file
    if (isFileLike(logoFile)) {
      const logoFileName = `${Date.now()}-${logoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`; // Sanitize filename
      const logoPath = path.join(uploadDir, logoFileName);
      try {
        const buffer = Buffer.from(await logoFile.arrayBuffer());
        await writeFile(logoPath, buffer);
        savedFiles.logo = `/uploads/${logoFileName}`;
      } catch (error) {
        console.error('Failed to save logo file:', error);
        return NextResponse.json(
          { success: false, message: 'Failed to save logo file' },
          { status: 500 }
        );
      }
    } else if (logoFileUrl) {
      savedFiles.logo = logoFileUrl;
    }

    // Save banner file (optional)
    if (isFileLike(bannerFile)) {
      const bannerFileName = `${Date.now()}-${bannerFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`; // Sanitize filename
      const bannerPath = path.join(uploadDir, bannerFileName);
      try {
        const buffer = Buffer.from(await bannerFile.arrayBuffer());
        await writeFile(bannerPath, buffer);
        savedFiles.banner = `/uploads/${bannerFileName}`;
      } catch (error) {
        console.error('Failed to save banner file:', error);
        return NextResponse.json(
          { success: false, message: 'Failed to save banner file' },
          { status: 500 }
        );
      }
    } else if (bannerFileUrl) {
      savedFiles.banner = bannerFileUrl;
    }

    // Prepare agent data for database
    const agentData = {
      userId,
      aiAgentName,
      agentDescription,
      domainExpertise,
      colorTheme,
      logoFile: savedFiles.logo,
      bannerFile: savedFiles.banner,
      updatedAt: new Date(),
    };

    // Save or update agent in the database
    const agent = await getOrCreateAgent(userId, agentData);
    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Failed to save or update agent' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Step 1 data saved successfully',
        agentId: agent._id,
        agent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in Step 1 API:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}