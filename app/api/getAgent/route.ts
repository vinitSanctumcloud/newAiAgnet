import { NextResponse } from 'next/server';
import agentModel from '@/app/lib/agentModel';
import connectDB from '../db';
import { Agent } from '@/app/lib/type';

// Base URL for your application (set this based on your environment)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Helper to sanitize URLs by removing double slashes
const sanitizeUrl = (url: string) => url.replace(/([^:]\/)\/+/g, '$1');

export async function GET(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Extract userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch the agent from MongoDB
    const agent = await agentModel.findOne<Agent>({ userId }).lean();

    if (!agent) {
      return NextResponse.json(
        { success: true, message: 'No agent found for this user' },
        { status: 200 }
      );
    }

    // Prepare sanitized URLs for logo, banner, and doc files
    const logoFile = agent.logoFile
      ? sanitizeUrl(`${BASE_URL}/${agent.logoFile.replace(/^\/+/, '')}`)
      : null;

    const bannerFile = agent.bannerFile
      ? sanitizeUrl(`${BASE_URL}/uploads/${agent.bannerFile.replace(/^\/+/, '')}`)
      : null;

    const csvFile = agent.csvFile
      ? sanitizeUrl(`${BASE_URL}/uploads/${agent.csvFile.replace(/^\/+/, '')}`)
      : null;

    const docFiles = agent.docFiles
      ? agent.docFiles.map((file) =>
          sanitizeUrl(`${BASE_URL}/${file.replace(/^\/+/, '')}`)
        )
      : [];

    // Construct response object
    const agentData: Agent = {
      userId: agent.userId,
      aiAgentName: agent.aiAgentName || '',
      agentDescription: agent.agentDescription || '',
      domainExpertise: agent.domainExpertise || '',
      colorTheme: agent.colorTheme || '#007bff',
      greeting: agent.greeting || '',
      tone: agent.tone || '',
      customRules: agent.customRules || '',
      conversationStarters: agent.conversationStarters || [],
      languages: agent.languages || '',
      enableFreeText: agent.enableFreeText ?? true,
      enableBranchingLogic: agent.enableBranchingLogic ?? true,
      conversationFlow: agent.conversationFlow || '',
      manualEntry: agent.manualEntry || [],
      logoFile,
      bannerFile,
      csvFile,
      docFiles,
      _id: agent._id?.toString(),
      __v: agent.__v,
      currentStep: agent.currentStep ?? 0,
    };

    console.log('✅ Agent data fetched:', agentData);

    return NextResponse.json({ success: true, data: agentData }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching agent data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch agent data',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
