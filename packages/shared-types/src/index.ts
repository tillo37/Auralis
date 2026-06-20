export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface HealthResponse {
  status: 'ok';
}

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserPublic = Omit<User, 'passwordHash'>;
