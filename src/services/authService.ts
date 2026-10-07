import api from './api';
import type { User } from '../types';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(data: { email: string; password: string }): Promise<LoginResponse> {
    return (await api.post('/auth/login', data)).data.data;
  },
  async register(data: { name: string; email: string; password: string }): Promise<{ message: string }> {
    return { message: (await api.post('/auth/register', data)).data.message };
  },
  async verifyEmail(token: string): Promise<{ message: string }> {
    return { message: (await api.get(`/auth/verify-email?token=${token}`)).data.message };
  },
  async getMe(): Promise<User> {
    return (await api.get('/auth/me')).data.data;
  },
  async updateProfile(data: { name?: string; password?: string }): Promise<User> {
    return (await api.put('/auth/profile', data)).data.data;
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
