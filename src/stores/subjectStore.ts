import { create } from 'zustand';
import { subjectService } from '../services/subjectService';
import type { Subject } from '../types';

interface SubjectState {
  subjects: Subject[];
  isLoading: boolean;
  fetchSubjects: () => Promise<void>;
  addSubject: (subject: Subject) => void;
  updateSubject: (id: number, subject: Subject) => void;
  removeSubject: (id: number) => void;
  clearSubjects: () => void;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: [],
  isLoading: false,

  fetchSubjects: async () => {
    try {
      set({ isLoading: true });
      const subjects = await subjectService.getAll();
      set({ subjects, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  addSubject: (subject) => set((s) => ({ subjects: [...s.subjects, subject] })),
  updateSubject: (id, subject) => set((s) => ({ subjects: s.subjects.map((x) => (x.id === id ? subject : x)) })),
  removeSubject: (id) => set((s) => ({ subjects: s.subjects.filter((x) => x.id !== id) })),
  clearSubjects: () => set({ subjects: [] }),
}));
