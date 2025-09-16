import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Agent interface (aligned with AiAgentInner's AgentInfo and Persona)
interface IAgent extends Document {
  userId: string;
  aiAgentName: string;
  agentDescription: string;
  domainExpertise: string;
  colorTheme: string;
  logoFile: string | null; // File path or URL
  bannerFile: string | null;
  greeting: string;
  tone: string;
  customRules: string;
  conversationStarters: string[];
  languages: string;
  enableFreeText: boolean;
  enableBranchingLogic: boolean;
  conversationFlow: string;
  manualEntry: { question: string; answer: string }[];
  csvFile: string | null;
  docFiles: string[];
  createdAt: Date;
  currentStep?: number; // Added to match AiAgentInner's expectation
}

// Define the schema
const AgentSchema: Schema<IAgent> = new Schema({
  userId: { type: String, required: true, unique: true },
  aiAgentName: { type: String, default: '' },
  agentDescription: { type: String, default: '' },
  domainExpertise: { type: String, default: '' },
  colorTheme: { type: String, default: '#007bff' },
  logoFile: { type: String, default: null },
  bannerFile: { type: String, default: null },
  greeting: { type: String, default: '' },
  tone: { type: String, default: '' },
  customRules: { type: String, default: '' },
  conversationStarters: { type: [String], default: [] },
  languages: { type: String, default: '' },
  enableFreeText: { type: Boolean, default: true }, // Aligned with AiAgentInner
  enableBranchingLogic: { type: Boolean, default: true }, // Aligned with AiAgentInner
  conversationFlow: { type: String, default: '' },
  manualEntry: [{ question: String, answer: String }, { default: [] }],
  csvFile: { type: String, default: null },
  docFiles: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  currentStep: { type: Number, default: 0 }, // Added to track step
});

// Function to get or create an agent for a user
async function getOrCreateAgent(userId: string, agentData: Partial<IAgent> = {}): Promise<IAgent> {
  try {
    let agent = await mongoose.models.Agent.findOne({ userId }).lean<IAgent>();

    if (!agent) {
      console.log(`Creating new agent for userId: ${userId}`); // Debugging
      agent = await mongoose.models.Agent.create({
        userId,
        aiAgentName: agentData.aiAgentName || '',
        agentDescription: agentData.agentDescription || '',
        domainExpertise: agentData.domainExpertise || '',
        colorTheme: agentData.colorTheme || '#007bff',
        logoFile: agentData.logoFile || null,
        bannerFile: agentData.bannerFile || null,
        greeting: agentData.greeting || '',
        tone: agentData.tone || '',
        customRules: agentData.customRules || '',
        conversationStarters: agentData.conversationStarters || [],
        languages: agentData.languages || '',
        enableFreeText: agentData.enableFreeText ?? true,
        enableBranchingLogic: agentData.enableBranchingLogic ?? true,
        conversationFlow: agentData.conversationFlow || '',
        manualEntry: agentData.manualEntry || [],
        csvFile: agentData.csvFile || null,
        docFiles: agentData.docFiles || [],
        createdAt: new Date(),
        currentStep: agentData.currentStep || 0,
      });
    } else {
      console.log(`Found existing agent for userId: ${userId}`, agent); // Debugging
    }

    return agent as IAgent;
  } catch (error) {
    console.error('Error in getOrCreateAgent:', error);
    throw new Error(`Failed to get or create agent: ${(error as Error).message}`);
  }
}

// Export the model with type
const AgentModel: Model<IAgent> = mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);

export default AgentModel;
export { getOrCreateAgent };