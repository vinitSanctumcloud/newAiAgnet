import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import agentModel from '@/app/lib/agentModel';
import connectDB from '../db';

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    let manualEntry: { question: string; answer: string }[] = [];

    try {
      const manualEntryJson = formData.get('manualEntry') as string;
      if (manualEntryJson) {
        manualEntry = JSON.parse(manualEntryJson);
        if (!Array.isArray(manualEntry) || !manualEntry.every(entry => 'question' in entry && 'answer' in entry)) {
          return NextResponse.json(
            { success: false, message: 'Invalid manual entry format. Must be an array of {question, answer} objects.' },
            { status: 400 }
          );
        }
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { success: false, message: 'Invalid manual entry format' },
        { status: 400 }
      );
    }

    const csvFile = formData.get('csvFile') as File | null;
    const docFiles = formData.getAll('docFiles') as File[];

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!manualEntry.length && !docFiles.length && !csvFile) {
      return NextResponse.json(
        { success: false, message: 'At least one FAQ or file must be provided' },
        { status: 400 }
      );
    }

    const agent = await agentModel.findOne({ userId });
    if (!agent || !agent.greeting) {
      return NextResponse.json(
        { success: false, message: 'Agent not found or previous steps incomplete (greeting missing)' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    let csvFileName: string | null = null;
    const savedDocs: string[] = [];

    if (csvFile) {
      csvFileName = `${Date.now()}-${csvFile.name}`;
      const csvPath = path.join(uploadDir, csvFileName);
      await writeFile(csvPath, Buffer.from(await csvFile.arrayBuffer()));
    }

    for (const doc of docFiles) {
      const docFileName = `${Date.now()}-${doc.name}`;
      const docPath = path.join(uploadDir, docFileName);
      await writeFile(docPath, Buffer.from(await doc.arrayBuffer()));
      savedDocs.push(docFileName);
    }

    const updatedAgent = await agentModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          manualEntry,
          csvFile: csvFileName,
          docFiles: savedDocs,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedAgent) {
      return NextResponse.json(
        { success: false, message: 'Failed to update agent' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Step 3 completed successfully. Agent updated.',
        agentId: updatedAgent._id,
        agent: updatedAgent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in Step 3 API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}