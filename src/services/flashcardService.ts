import api from './api';
import type { Flashcard, FlashcardInput, FlashcardStats } from '../types';

/** Preenche os campos "achatados" (nextReviewDate, subjectName...) a partir do que a API devolve. */
function normalize(card: Flashcard): Flashcard {
  return {
    ...card,
    nextReviewDate: card.nextReviewDate ?? card.nextReview,
    subjectName: card.subjectName ?? card.subject?.name,
    subjectColor: card.subjectColor ?? card.subject?.color,
    topicName: card.topicName ?? card.topic?.name,
  };
}

export const flashcardService = {
  async getAll(): Promise<Flashcard[]> {
    return ((await api.get('/flashcards')).data.data as Flashcard[]).map(normalize);
  },
  async getDueForReview(): Promise<Flashcard[]> {
    return ((await api.get('/flashcards/review/due')).data.data as Flashcard[]).map(normalize);
  },
  async getById(id: number): Promise<Flashcard> {
    return normalize((await api.get(`/flashcards/${id}`)).data.data);
  },
  async create(data: FlashcardInput): Promise<Flashcard> {
    return normalize((await api.post('/flashcards', data)).data.data);
  },
  async update(
    id: number,
    data: { front?: string; back?: string; subjectId?: number | null; topicId?: number | null },
  ): Promise<Flashcard> {
    return normalize((await api.put(`/flashcards/${id}`, data)).data.data);
  },
  /** quality: 0 Novamente · 1 Difícil · 2 Bom · 3 Fácil (o backend converte para a escala SM-2). */
  async review(id: number, data: { quality: number }): Promise<Flashcard> {
    return normalize((await api.post(`/flashcards/${id}/review`, data)).data.data);
  },
  async getReviewHistory(id: number) {
    return (await api.get(`/flashcards/${id}/history`)).data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/flashcards/${id}`);
  },
  async getStats(): Promise<FlashcardStats> {
    return (await api.get('/flashcards/stats')).data.data;
  },
};
