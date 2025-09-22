import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types
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
}

interface SignupCredentials {
  email: string;
  name: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  name?: string;
}

// Define the initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Base API URL
const API_BASE_URL = 'https://qkkso80gw8ss0kscc8c4skkg.prod.sanctumcloud.com/api/auth';

// Helper function to store token in localStorage
const storeToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Helper function to get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Define the signup async thunk
export const register = createAsyncThunk<
  { user: User; token: string }, // Return type now includes token
  SignupCredentials,
  { rejectValue: string }
>('auth/register', async ({ email, name, password }: SignupCredentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      email,
      name,
      password,
    });
    
    // Assuming the API returns both user and token
    const { user, token } = response.data;
    
    // Store token in localStorage
    if (token) {
      storeToken(token);
    }
    
    return { user, token };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to register');
  }
});

// Define the login async thunk
export const login = createAsyncThunk<
  { user: User; token: string }, // Return type now includes token
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    
    // Assuming the API returns both user and token
    const { user, token } = response.data;
    
    // Store token in localStorage
    if (token) {
      storeToken(token);
    }
    
    return { user, token };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to login');
  }
});

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Remove token from localStorage on logout
      removeToken();
    },
    // Add a reducer to initialize auth state from localStorage
    initializeAuth: (state) => {
      const token = getToken();
      if (token) {
        state.isAuthenticated = true;
        // Note: You might want to decode the token to get user info
        // or make an API call to get user details using the token
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
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
        state.error = action.payload as string;
      })
      // Login cases
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
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { logout, initializeAuth } = authSlice.actions;

// Export selectors
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;

// Export the reducer
export default authSlice.reducer;