import api from './api';
import type { Topic, TopicInput } from '../types';

export const topicService = {
  async getBySubjectId(subjectId: number): Promise<Topic[]> {
    return (await api.get(`/topics/subject/${subjectId}`)).data.data;
  },
  async getById(id: number): Promise<Topic> {
    return (await api.get(`/topics/${id}`)).data.data;
  },
  async create(data: TopicInput): Promise<Topic> {
    return (await api.post('/topics', data)).data.data;
  },
  async update(id: number, data: Partial<TopicInput>): Promise<Topic> {
    return (await api.put(`/topics/${id}`, data)).data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/topics/${id}`);
  },
};
