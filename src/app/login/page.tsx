'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // User is signed in, redirect to dashboard
        router.push('/dashboard');
      } else {
        // User is signed out
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <AuthForm onSuccess={handleAuthSuccess} />;
} 