export interface AgentInfo {
  _id?: string;
  aiAgentName: string;
  agentDescription: string;
  domainExpertise: string;
  colorTheme: string;
  logoFile: File | string | null;
  bannerFile: File | string | null;
  docFiles: string[] | File[] | undefined;
  manualEntry?: Array<{ question: string; answer: string; _id?: string }>;
  userId: string;
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

export interface Agent {
  enableBranchingLogic: boolean;
  enableFreeText: boolean;
  languages: string;
  conversationFlow: string;
  customRules: string;
  tone: string;
  conversationStarters: string[];
  greeting: string;
  // Adjust based on your actual Agent interface
  id: string;
  userId: string;
  aiAgentName: string;
  agentDescription: string;
  domainExpertise: string;
  colorTheme: string;
  logoFile: File | string | null;
  bannerFile?: File | string | null;
  docFiles: string[] | File[] | undefined;
  manualEntry?: Array<{ question: string; answer: string; _id?: string }>;
  persona: Persona;
}