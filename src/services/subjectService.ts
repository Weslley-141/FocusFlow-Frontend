import api from './api';
import type { Subject, SubjectInput, SubjectStats } from '../types';

export const subjectService = {
  async getStats(): Promise<SubjectStats> {
    return (await api.get('/subjects/stats')).data.data;
  },
  async getAll(): Promise<Subject[]> {
    return (await api.get('/subjects')).data.data;
  },
  async getById(id: number): Promise<Subject> {
    return (await api.get(`/subjects/${id}`)).data.data;
  },
  async create(data: SubjectInput): Promise<Subject> {
    return (await api.post('/subjects', data)).data.data;
  },
  async update(id: number, data: Partial<SubjectInput>): Promise<Subject> {
    return (await api.put(`/subjects/${id}`, data)).data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/subjects/${id}`);
  },
};
