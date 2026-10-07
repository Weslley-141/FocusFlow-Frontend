import { useEffect, useRef } from 'react';
import { usePomodoroStore } from '../stores/pomodoroStore';

/** Dispara o `tick` do store a cada segundo enquanto o timer está rodando e não pausado. */
export function usePomodoroTimer() {
  const { isRunning, isPaused, tick } = usePomodoroStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef(tick);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => tickRef.current(), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);
}
