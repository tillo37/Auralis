'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserPublic } from '@auralis/shared-types';
import { auth } from '@/lib/api';
import { setToken } from '@/lib/auth';
import type { RegisterFormData } from '@/features/auth/schemas';

interface AuthContextValue {
  user: UserPublic | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (dto: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<UserPublic>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      setIsLoading(false);
      return;
    }
    auth
      .me()
      .then(setUser)
      .catch(() => {
        auth.logout();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const u = await auth.login({ email, password });
      setUser(u);
      router.push('/');
    },
    [router],
  );

  const register = useCallback(
    async (dto: RegisterFormData) => {
      const res = await auth.register(dto);
      setToken(res.accessToken);
      setUser(res.user);
      router.push('/');
    },
    [router],
  );

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  const updateUser = useCallback((partial: Partial<UserPublic>) => {
    setUser((u) => (u ? { ...u, ...partial } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
