import axios from 'axios';

interface Credentials {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const register = async ({ email, password }: Credentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Registration failed');
    }
    throw new Error('Network error during registration');
  }
};