import type { UserPublic } from '@auralis/shared-types';
import { apiClient } from './client';
import { getToken, setToken, removeToken } from '../auth';

interface AuthResult {
  user: UserPublic;
  accessToken: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  displayName: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const auth = {
  async register(dto: RegisterDto): Promise<AuthResult> {
    return apiClient.post<AuthResult>('/auth/register', dto);
  },

  async login(dto: LoginDto): Promise<UserPublic> {
    const res = await apiClient.post<AuthResult>('/auth/login', dto);
    setToken(res.accessToken);
    return res.user;
  },

  logout(): void {
    removeToken();
  },

  async me(): Promise<UserPublic> {
    return apiClient.get<UserPublic>('/auth/me');
  },

  isLoggedIn(): boolean {
    return getToken() !== null;
  },

  // TODO: PATCH /auth/profile endpoint is not yet implemented on the backend.
  // Add the endpoint in the next backend pass, then replace the no-op below with:
  //   return apiClient.patch<UserPublic>('/auth/profile', dto);
  async updateProfile(_dto: { displayName?: string; username?: string }): Promise<void> {
    // no-op until backend endpoint is ready
  },
};
