import api from './api';
import type { Goal, GoalInput, GoalStats } from '../types';

export const goalService = {
  async getAll(): Promise<Goal[]> {
    return (await api.get('/goals')).data.data;
  },
  async getActive(): Promise<Goal[]> {
    return (await api.get('/goals/active')).data.data;
  },
  async getById(id: number): Promise<Goal> {
    return (await api.get(`/goals/${id}`)).data.data;
  },
  async create(data: GoalInput): Promise<Goal> {
    return (await api.post('/goals', data)).data.data;
  },
  async update(id: number, data: Partial<GoalInput>): Promise<Goal> {
    return (await api.put(`/goals/${id}`, data)).data.data;
  },
  async updateProgress(id: number, data: { minutesToAdd: number }): Promise<Goal> {
    return (await api.post(`/goals/${id}/progress`, data)).data.data;
  },
  async markAsFailed(id: number): Promise<Goal> {
    return (await api.post(`/goals/${id}/fail`)).data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/goals/${id}`);
  },
  async getStats(): Promise<GoalStats> {
    return (await api.get('/goals/stats')).data.data;
  },
};
