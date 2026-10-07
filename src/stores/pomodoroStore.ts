import { create } from 'zustand';

interface PomodoroState {
  isRunning: boolean;
  isPaused: boolean;
  isBreak: boolean;
  timeLeft: number; // segundos
  duration: number; // minutos de foco
  breakTime: number; // minutos de pausa
  start: (duration: number, breakTime: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  tick: () => void;
  startBreak: () => void;
  reset: () => void;
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  isRunning: false,
  isPaused: false,
  isBreak: false,
  timeLeft: 0,
  duration: 25,
  breakTime: 5,

  start: (duration, breakTime) =>
    set({ isRunning: true, isPaused: false, isBreak: false, duration, breakTime, timeLeft: duration * 60 }),
  pause: () => set({ isPaused: true }),
  resume: () => set({ isPaused: false }),
  stop: () => set({ isRunning: false, isPaused: false, isBreak: false, timeLeft: 0 }),

  tick: () => {
    const s = get();
    if (!s.isRunning || s.isPaused) return;
    if (s.timeLeft > 0) set({ timeLeft: s.timeLeft - 1 });
    else if (s.isBreak) set({ isRunning: false, isBreak: false, timeLeft: 0 });
    else set({ isBreak: true, timeLeft: s.breakTime * 60 });
  },

  startBreak: () => set({ isBreak: true, timeLeft: get().breakTime * 60 }),
  reset: () => set({ isRunning: false, isPaused: false, isBreak: false, timeLeft: 0, duration: 25, breakTime: 5 }),
}));
