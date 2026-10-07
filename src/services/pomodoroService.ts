import api from './api';
import type { PomodoroSession, PomodoroStats } from '../types';

export const pomodoroService = {
  async create(data: { duration: number; breakTime: number; topicId?: number }): Promise<PomodoroSession> {
    return (await api.post('/pomodoro', data)).data.data;
  },
  async getAll(): Promise<PomodoroSession[]> {
    return (await api.get('/pomodoro')).data.data;
  },
  async getCompleted(): Promise<PomodoroSession[]> {
    return (await api.get('/pomodoro/completed')).data.data;
  },
  async getActive(): Promise<PomodoroSession | null> {
    return (await api.get('/pomodoro/active')).data.data;
  },
  async getById(id: number): Promise<PomodoroSession> {
    return (await api.get(`/pomodoro/${id}`)).data.data;
  },
  async complete(id: number, data: Record<string, never> = {}): Promise<PomodoroSession> {
    return (await api.put(`/pomodoro/${id}/complete`, data)).data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/pomodoro/${id}`);
  },
  async getStats(): Promise<PomodoroStats> {
    return (await api.get('/pomodoro/stats')).data.data;
  },
};
