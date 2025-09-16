'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/app/components/auth/AuthForm';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react'; // Assuming you're using lucide-react for icons

export default function LoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/dashboard');
        }
    }, [status, router]);

    // Display a loading indicator during session loading
    if (status === 'loading') {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    const handleLogin = async ({ email, password }: { email: string; password: string }) => {
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
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <AuthForm onSubmit={handleLogin} buttonText="Login" />
        </div>
    );
}