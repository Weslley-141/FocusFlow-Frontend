import api from './api';
import type { MindMap, MindMapInput, MindMapNode } from '../types';

export const mindmapService = {
  async create(data: MindMapInput): Promise<MindMap> {
    return (await api.post('/mindmaps', data)).data.data;
  },
  async getAll(): Promise<MindMap[]> {
    return (await api.get('/mindmaps')).data.data;
  },
  async getById(id: number): Promise<MindMap> {
    return (await api.get(`/mindmaps/${id}`)).data.data;
  },
  async update(id: number, data: Partial<MindMapInput>): Promise<MindMap> {
    return (await api.put(`/mindmaps/${id}`, data)).data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/mindmaps/${id}`);
  },
  async getNodes(mapId: number): Promise<MindMapNode[]> {
    return (await api.get(`/mindmaps/${mapId}/nodes`)).data.data;
  },
  async createNode(mapId: number, data: Partial<MindMapNode>): Promise<MindMapNode> {
    return (await api.post(`/mindmaps/${mapId}/nodes`, data)).data.data;
  },
  async updateNode(nodeId: number, data: Partial<MindMapNode>): Promise<MindMapNode> {
    return (await api.put(`/mindmaps/nodes/${nodeId}`, data)).data.data;
  },
  async updateNodePosition(nodeId: number, data: { positionX: number; positionY: number }): Promise<MindMapNode> {
    return (await api.patch(`/mindmaps/nodes/${nodeId}/position`, data)).data.data;
  },
  async deleteNode(nodeId: number): Promise<void> {
    await api.delete(`/mindmaps/nodes/${nodeId}`);
  },
};
