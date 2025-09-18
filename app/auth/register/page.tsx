'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthForm from '@/app/components/auth/AuthForm';
import { register } from '@/app/lib/auth';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegister = async ({ email, password }: { email: string; password: string }) => {
    try {
      await register({ email, password });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err; // Let AuthForm handle the error display
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        {/* <h1 className="text-2xl font-bold mb-4">Register</h1> */}
        <AuthForm onSubmit={handleRegister} buttonText="Register" />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}