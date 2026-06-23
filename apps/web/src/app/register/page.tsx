'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard, RegisterForm } from '@/features/auth';
import { useAuth } from '@/providers/auth-provider';
import type { RegisterFormData } from '@/features/auth/schemas';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: RegisterFormData) {
    setError(null);
    try {
      await register(data);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join Auralis and start listening"
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm onSubmit={handleSubmit} error={error} />
    </AuthCard>
  );
}
