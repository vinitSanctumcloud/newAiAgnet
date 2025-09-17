import axios from 'axios';

interface Credentials {
  email: string;
  password: string;
}

// Adjust this based on your actual API response
interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    // Add more fields here as needed
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const register = async ({ email, password }: Credentials): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, { email, password });
  return response.data;
};
