import { NextResponse } from 'next/server';
import agentModel from '@/app/lib/agentModel';
import connectDB from '../db';

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse form data
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const greeting = formData.get('greeting') as string;
    const tone = formData.get('tone') as string;
    const customRules = formData.get('customRules') as string;
    let conversationStarters: string[] = [];

    // Parse conversationStarters
    try {
      const startersJson = formData.get('conversationStarters') as string;
      if (startersJson) {
        conversationStarters = JSON.parse(startersJson);
        if (!Array.isArray(conversationStarters) || conversationStarters.length === 0) {
          return NextResponse.json(
            { success: false, message: 'At least one conversation starter is required' },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { success: false, message: 'Conversation starters are required' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid conversation starters format' },
        { status: 400 }
      );
    }

    const languages = formData.get('languages') as string;
    const enableFreeText = formData.get('enableFreeText') === 'true';
    const enableBranchingLogic = formData.get('enableBranchingLogic') === 'true';
    const conversationFlow = formData.get('conversationFlow') as string;

    // Validation
    if (!userId || !greeting || !tone || !customRules || !languages || !conversationFlow) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if agent exists
    const agent = await agentModel.findOne({ userId });
    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Agent not found. Step 1 data missing.' },
        { status: 400 }
      );
    }

    // Update agent in MongoDB
    const updatedAgent = await agentModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          greeting,
          tone,
          customRules,
          conversationStarters,
          languages,
          enableFreeText,
          enableBranchingLogic,
          conversationFlow,
          updatedAt: new Date(), // Track last update
        },
      },
      { new: true, runValidators: true } // Return updated document and enforce schema validation
    );

    if (!updatedAgent) {
      return NextResponse.json(
        { success: false, message: 'Failed to update agent' },
        { status: 500 }
      );
    }

    // Return full agent data
    return NextResponse.json(
      {
        success: true,
        message: 'Step 2 data saved successfully',
        agentId: updatedAgent._id,
        agent: updatedAgent, // Full agent data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in Step 2 API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}