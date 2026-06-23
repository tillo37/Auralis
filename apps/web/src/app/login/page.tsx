'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard, LoginForm } from '@/features/auth';
import { useAuth } from '@/providers/auth-provider';
import type { LoginFormData } from '@/features/auth/schemas';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: LoginFormData) {
    setError(null);
    try {
      await login(data);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your Auralis account"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm onSubmit={handleSubmit} error={error} />
    </AuthCard>
  );
}
