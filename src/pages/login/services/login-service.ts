import { httpClient } from '@/shared/api/httpClient';
import type { User } from '@/shared/interfaces/user';

export interface LoginResponse {
    token: string;
    user: User;
}

export const authService = {
  login: (email: string, senha: string) => {
      return httpClient.post<LoginResponse>('/auth/login', { email, senha });
  },
};