import { NextResponse } from 'next/server';
import agentModel from '@/app/lib/agentModel';
import connectDB from '../db';
import { Agent } from '@/app/lib/type';

// Base URL for your application (set this based on your environment)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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

    // Fetch agent with all fields, typed as Agent | null
    const agent = await agentModel.findOne<Agent>({ userId }).lean();

    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'No agent found for this user' },
        { status: 404 }
      );
    }

    // Construct response with all fields
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
        logoFile: agent.logoFile ? `${BASE_URL}${agent.logoFile}` : null,
        bannerFile: agent.bannerFile ? `${BASE_URL}/uploads/${agent.bannerFile}` : null,
        csvFile: agent.csvFile ? `${BASE_URL}/uploads/${agent.csvFile}` : null,
        docFiles: agent.docFiles ? agent.docFiles.map(file => `${BASE_URL}/${file}`) : [],
        _id: agent._id?.toString(), // Convert ObjectId to string
        __v: agent.__v,
        currentStep: 0
    };

    console.log('Fetched agent data for userId:', userId, agentData); // Debugging log

    return NextResponse.json(
      { success: true, data: agentData },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching agent data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch agent data', error: (error as Error).message },
      { status: 500 }
    );
  }
}