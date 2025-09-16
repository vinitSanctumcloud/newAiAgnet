import axios from 'axios';

interface Credentials {
    email: string;
    password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const register = async ({ email, password }: Credentials): Promise<any> => {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response.data;
};