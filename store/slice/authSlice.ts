import { getToken, removeAuthToken, setAuthToken } from '@/utils/authToken';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
interface User {
  uid: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  aiAgentData: any | null; // Adjust type based on actual AI agent response
}

interface SignupCredentials {
  email: string;
  name: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  aiAgentData: null,
};

const API_BASE_URL = 'https://qkkso80gw8ss0kscc8c4skkg.prod.sanctumcloud.com';

const handleError = (error: any, defaultMessage: string) => {
  return error?.response?.data?.message || defaultMessage;
};

// 🔐 Validate Token
export const validateToken = createAsyncThunk<
  { user: User },
  void,
  { rejectValue: string }
>('auth/validateToken', async (_, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue('No token found');

    const response = await axios.get(`${API_BASE_URL}/protected/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { user: response.data?.user };
  } catch (error) {
    removeAuthToken();
    return rejectWithValue(handleError(error, 'Invalid token'));
  }
});

// 📝 Register
export const register = createAsyncThunk<
  { user: User; token: string },
  SignupCredentials,
  { rejectValue: string }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, credentials);
    const { user, token } = response.data;

    if (token) setAuthToken(token);
    return { user, token };
  } catch (error) {
    return rejectWithValue(handleError(error, 'Failed to register'));
  }
});

// 🔓 Login
export const login = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
    const { user, token } = response.data;

    if (token) setAuthToken(token);
    return { user, token };
  } catch (error) {
    return rejectWithValue(handleError(error, 'Failed to login'));
  }
});

// 🤖 Fetch AI Agent Data
// 🤖 Fetch AI Agent Data (No token, dynamic agent ID)
export const fetchAIAgentData = createAsyncThunk<
  { aiAgentData: any },
  string, // Pass agentId as the payload
  { rejectValue: string }
>('auth/fetchAIAgentData', async (agentId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/ai-agents/${agentId}`);
    return { aiAgentData: response.data };
  } catch (error) {
    return rejectWithValue(handleError(error, 'Failed to fetch AI agent data'));
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.aiAgentData = null;
      removeAuthToken();
    },
    initializeAuth: (state) => {
      const token = getToken();
      state.isAuthenticated = !!token;
      state.isLoading = !!token; // Only load if token exists
    },
    resetError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.aiAgentData = null;
      removeAuthToken();
    },
  },
  extraReducers: (builder) => {
    builder
      // Validate Token
      .addCase(validateToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || 'Token validation failed';
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })

      // Fetch AI Agent Data
      .addCase(fetchAIAgentData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAIAgentData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.aiAgentData = action.payload.aiAgentData;
      })
      .addCase(fetchAIAgentData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch AI agent data';
      });
  },
});

export const { logout, initializeAuth, resetError, clearAuth } = authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAIAgentData = (state: { auth: AuthState }) => state.auth.aiAgentData;

export default authSlice.reducer;