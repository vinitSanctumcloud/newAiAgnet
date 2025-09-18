import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import agentModel, { getOrCreateAgent } from '@/app/lib/agentModel';
import connectDB from '../db';

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const aiAgentName = formData.get('aiAgentName') as string;
    const agentDescription = formData.get('agentDescription') as string;
    const domainExpertise = formData.get('domainExpertise') as string;
    const colorTheme = formData.get('colorTheme') as string;
    const logoFile = formData.get('logoFile') as File | null;
    const bannerFile = formData.get('bannerFile') as File | null;
    const logoFileUrl = formData.get('logoFileUrl') as string | null;
    const bannerFileUrl = formData.get('bannerFileUrl') as string | null;

    // Log received data for debugging
    console.log({ userId, aiAgentName, agentDescription, domainExpertise, colorTheme, logoFile, bannerFile, logoFileUrl, bannerFileUrl }, 'Data from request');

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }
    if (!aiAgentName || !agentDescription || !domainExpertise) {
      return NextResponse.json(
        { success: false, message: 'All required fields (name, description, expertise) must be provided' },
        { status: 400 }
      );
    }
    if (!logoFile && !logoFileUrl) {
      return NextResponse.json(
        { success: false, message: 'Logo file or URL is required' },
        { status: 400 }
      );
    }

    // File size validation
    if (logoFile && logoFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Logo file size exceeds 5MB' },
        { status: 400 }
      );
    }
    if (bannerFile && bannerFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Banner file size exceeds 10MB' },
        { status: 400 }
      );
    }

    // Validate file types
    if (logoFile && !logoFile.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Logo must be an image file' },
        { status: 400 }
      );
    }
    if (bannerFile && !bannerFile.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Banner must be an image file' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    const savedFiles: { logo?: string; banner?: string } = {};

    // Handle logo file
    if (logoFile && logoFile instanceof File) {
      const logoFileName = `${Date.now()}-${logoFile.name}`;
      const logoPath = path.join(uploadDir, logoFileName);
      await writeFile(logoPath, Buffer.from(await logoFile.arrayBuffer()));
      savedFiles.logo = `/uploads/${logoFileName}`;
    } else if (logoFileUrl) {
      savedFiles.logo = logoFileUrl;
    }

    // Handle banner file (optional)
    if (bannerFile && bannerFile instanceof File) {
      const bannerFileName = `${Date.now()}-${bannerFile.name}`;
      const bannerPath = path.join(uploadDir, bannerFileName);
      await writeFile(bannerPath, Buffer.from(await bannerFile.arrayBuffer()));
      savedFiles.banner = `/uploads/${bannerFileName}`;
    } else if (bannerFileUrl) {
      savedFiles.banner = bannerFileUrl;
    }

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

    const agent = await getOrCreateAgent(userId, agentData);

    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Failed to save or update agent' },
        { status: 500 }
      );
    }

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
      { success: false, message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}