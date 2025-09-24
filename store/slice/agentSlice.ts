import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define interfaces for type safety
export interface FAQItem {
  _id?: string;
  question: string;
  answer: string;
}

export interface IAIAgent {
  _id?: string;
  userId: string;
  aiAgentName: string;
  aiAgentSlug?: string;
  agentDescription?: string;
  domainExpertise?: string;
  colorTheme?: string;
  logoFile?: File | string | null;
  bannerFile?: File | string | null;
  greeting?: string;
  tone?: string;
  customRules?: string;
  conversationStarters?: string[];
  languages?: string;
  enableFreeText?: boolean;
  enableBranchingLogic?: boolean;
  conversationFlow?: string;
  manualEntry?: FAQItem[];
  csvFile?: File | string | null;
  docFiles?: (File | string)[];
  createdAt?: string;
  currentStep?: number;
}

export interface AgentState {
  agent: IAIAgent | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AgentState = {
  agent: null,
  loading: false,
  error: null,
};

// Async thunk for creating/updating Step 1
export const createAgentStep1 = createAsyncThunk(
  "agent/createAgentStep1",
  async (
    payload: {
      aiAgentName: string;
      agentDescription: string;
      domainExpertise: string;
      colorTheme: string;
      logoFile: File | null;
      bannerFile: File | null;
      userId: string;
    },
    thunkAPI
  ) => {
    try {
      const token = localStorage.getItem("auth-token");
      const formData = new FormData();
      formData.append("aiAgentName", payload.aiAgentName);
      formData.append("agentDescription", payload.agentDescription);
      formData.append("domainExpertise", payload.domainExpertise);
      formData.append("colorTheme", payload.colorTheme);
      formData.append("userId", payload.userId);
      if (payload.logoFile) formData.append("logoFile", payload.logoFile);
      if (payload.bannerFile) formData.append("bannerFile", payload.bannerFile);

      const response = await axios.post(
        "https://qkkso80gw8ss0kscc8c4skkg.prod.sanctumcloud.com/protected/ai-agents/step1",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data as IAIAgent;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create/update agent");
    }
  }
);

// Async thunk for updating Step 2
export const updateAgentStep2 = createAsyncThunk(
  "agent/updateAgentStep2",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: {
        greeting?: string;
        tone?: string;
        customRules?: string;
        conversationStarters?: string[];
        languages?: string;
        enableFreeText?: boolean;
        enableBranchingLogic?: boolean;
        conversationFlow?: string;
        configFile?: File | null;
      };
    },
    thunkAPI
  ) => {
    try {
      const token = localStorage.getItem("auth-token");
      const formData = new FormData();
      if (data.greeting) formData.append("greeting", data.greeting);
      if (data.tone) formData.append("tone", data.tone);
      if (data.customRules) formData.append("customRules", data.customRules);
      if (data.conversationStarters) {
        data.conversationStarters.forEach((starter, index) => {
          formData.append(`conversationStarters[${index}]`, starter);
        });
      }
      if (data.languages) formData.append("languages", data.languages);
      if (data.enableFreeText !== undefined)
        formData.append("enableFreeText", data.enableFreeText.toString());
      if (data.enableBranchingLogic !== undefined)
        formData.append("enableBranchingLogic", data.enableBranchingLogic.toString());
      if (data.conversationFlow) formData.append("conversationFlow", data.conversationFlow);
      if (data.configFile) formData.append("configFile", data.configFile);

      const response = await axios.put(
        `https://qkkso80gw8ss0kscc8c4skkg.prod.sanctumcloud.com/protected/ai-agents/step2/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data as IAIAgent;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update agent step 2");
    }
  }
);

// Async thunk for updating Step 3
export const updateAgentStep3 = createAsyncThunk(
  "agent/updateAgentStep3",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: {
        manualEntry?: FAQItem[];
        csvFile?: File | null;
        docFiles?: File[];
      };
    },
    thunkAPI
  ) => {
    try {
      const token = localStorage.getItem("auth-token");
      const formData = new FormData();
      if (data.manualEntry) {
        formData.append("manualEntry", JSON.stringify(data.manualEntry));
      }
      if (data.csvFile) formData.append("csvFile", data.csvFile);
      if (data.docFiles) {
        data.docFiles.forEach((file) => formData.append("docFiles", file));
      }

      const response = await axios.put(
        `https://qkkso80gw8ss0kscc8c4skkg.prod.sanctumcloud.com/protected/ai-agents/step3/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data as IAIAgent;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update agent step 3");
    }
  }
);

// Async thunk for fetching user agent
export const fetchUserAgent = createAsyncThunk(
  "agent/fetchUserAgent",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(
        "https://qkkso80gw8ss0kscc8c4skkg.prod.sanctumcloud.com/protected/ai-agents/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data as IAIAgent;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch agent");
    }
  }
);

// Agent slice
export const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAgent: (state) => {
      state.agent = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create/Update Step 1
      .addCase(createAgentStep1.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgentStep1.fulfilled, (state, action: PayloadAction<IAIAgent>) => {
        state.loading = false;
        state.agent = action.payload;
        state.error = null;
      })
      .addCase(createAgentStep1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Step 2
      .addCase(updateAgentStep2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgentStep2.fulfilled, (state, action: PayloadAction<IAIAgent>) => {
        state.loading = false;
        state.agent = action.payload;
        state.error = null;
      })
      .addCase(updateAgentStep2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Step 3
      .addCase(updateAgentStep3.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgentStep3.fulfilled, (state, action: PayloadAction<IAIAgent>) => {
        state.loading = false;
        state.agent = action.payload;
        state.error = null;
      })
      .addCase(updateAgentStep3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch User Agent
      .addCase(fetchUserAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAgent.fulfilled, (state, action: PayloadAction<IAIAgent>) => {
        state.loading = false;
        state.agent = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetAgent } = agentSlice.actions;
export default agentSlice.reducer;