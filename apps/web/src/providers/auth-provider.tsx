'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { UserPublic } from '@auralis/shared-types';
import { apiClient } from '@/lib/api';
import {
  clearAuth,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '@/lib/auth';
import type { LoginFormData, RegisterFormData } from '@/features/auth/schemas';

interface AuthResponse {
  user: UserPublic;
  accessToken: string;
}

interface AuthContextValue {
  user: UserPublic | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    const token = getToken();
    if (storedUser && token) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginFormData) => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    setToken(res.accessToken);
    setStoredUser(res.user);
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: RegisterFormData) => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    setToken(res.accessToken);
    setStoredUser(res.user);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
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
