import { useCallback, useEffect, useState } from 'react';
import { pomodoroService } from '../services/pomodoroService';
import { flashcardService } from '../services/flashcardService';
import { goalService } from '../services/goalService';
import { subjectService } from '../services/subjectService';

export interface DashboardStats {
  pomodoro: { totalMinutes: number; totalSessions: number; completedSessions: number };
  flashcards: { totalCards: number; dueForReview: number; newCards: number; masteredCards: number };
  goals: { totalGoals: number; completedGoals: number; activeGoals: number; completionRate: number };
  subjects: { totalSubjects: number; activeSubjects: number };
  isLoading: boolean;
  error: string | null;
}

const initial: DashboardStats = {
  pomodoro: { totalMinutes: 0, totalSessions: 0, completedSessions: 0 },
  flashcards: { totalCards: 0, dueForReview: 0, newCards: 0, masteredCards: 0 },
  goals: { totalGoals: 0, completedGoals: 0, activeGoals: 0, completionRate: 0 },
  subjects: { totalSubjects: 0, activeSubjects: 0 },
  isLoading: true,
  error: null,
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(initial);

  const refetch = useCallback(async () => {
    try {
      setStats((s) => ({ ...s, isLoading: true, error: null }));
      const [pomodoro, flashcards, goals, subjects] = await Promise.all([
        pomodoroService.getStats(),
        flashcardService.getStats(),
        goalService.getStats(),
        subjectService.getStats(),
      ]);
      setStats({
        pomodoro: {
          totalMinutes: pomodoro.totalMinutes,
          totalSessions: pomodoro.totalSessions,
          completedSessions: pomodoro.completedSessions,
        },
        flashcards: {
          totalCards: flashcards.totalCards,
          dueForReview: flashcards.dueForReview,
          newCards: flashcards.newCards,
          masteredCards: flashcards.masteredCards,
        },
        goals: {
          totalGoals: goals.totalGoals,
          completedGoals: goals.completedGoals,
          activeGoals: goals.activeGoals,
          completionRate: goals.completionRate,
        },
        subjects: { totalSubjects: subjects.totalSubjects, activeSubjects: subjects.activeSubjects },
        isLoading: false,
        error: null,
      });
    } catch {
      setStats((s) => ({ ...s, isLoading: false, error: 'Erro ao carregar estatísticas' }));
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { stats, refetch };
}
