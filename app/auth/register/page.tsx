'use client';

import { useRouter } from 'next/navigation';
import AuthForm from '@/app/components/auth/AuthForm';
import { register } from '@/app/lib/auth';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async ({ email, password }: { email: string; password: string }) => {
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
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthForm onSubmit={handleRegister} buttonText="Register" />
    </div>
  );
}