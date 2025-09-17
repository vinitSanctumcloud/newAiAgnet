export interface AgentInfo {
    userId: string; // Added to match IAgent and usage in page.tsx
  aiAgentName: string;
  agentDescription: string;
  domainExpertise: string;
  colorTheme: string;
  docFiles: File[] | string[]; // Allow both File[] and string[]
  manualEntry: { question: string; answer: string }[];
  logoFile: File | string | null;
  bannerFile: File | string | null;
  // csvFile: File | string | null;
}

export interface Agent {
  currentStep: number;
  userId: string;
  aiAgentName?: string;
  agentDescription?: string;
  domainExpertise?: string;
  colorTheme?: string;
  greeting?: string;
  tone?: string;
  customRules?: string;
  conversationStarters?: string[];
  languages?: string;
  enableFreeText?: boolean;
  enableBranchingLogic?: boolean;
  conversationFlow?: string;
  manualEntry?: { question: string; answer: string }[];
  logoFile?: string | null;
  bannerFile?: string | null;
  csvFile?: string | null;
  docFiles?: string[];
  _id?: string;
  __v?: number;
}

export interface Persona {
  greeting: string;
  tone: string;
  customRules: string;
  conversationStarters: string[];
  languages: string;
  enableFreeText: boolean;
  enableBranchingLogic: boolean;
  conversationFlow: string;
}