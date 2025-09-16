'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    if (session) {
      router.push('/dashboard'); // Redirect authenticated users to dashboard
    } else {
      router.push('/auth/login'); // Redirect unauthenticated users to login
    }
  }, [session, status, router]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to the App</h1>
      <p>Loading...</p> {/* Shown briefly during session check */}
    </div>
  );
}