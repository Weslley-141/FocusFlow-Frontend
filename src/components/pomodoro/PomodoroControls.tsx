import { useEffect, useRef } from 'react';
import { Pause, Play, RotateCcw, Square } from 'lucide-react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import Button from '../ui/Button';

interface PomodoroControlsProps {
  /** Chamado uma única vez quando o foco termina e a pausa começa. */
  onComplete?: () => void;
}

export default function PomodoroControls({ onComplete }: PomodoroControlsProps) {
  const { isRunning, isPaused, isBreak, pause, resume, stop, reset } = usePomodoroStore();
  const completedRef = useRef(false);
  const wasBreakRef = useRef(false);

  useEffect(() => {
    if (isRunning && isBreak && !wasBreakRef.current && onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
    wasBreakRef.current = isBreak;
    if (!isRunning) {
      completedRef.current = false;
      wasBreakRef.current = false;
    }
  }, [isRunning, isBreak, onComplete]);

  return (
    <div className="flex items-center justify-center gap-4">
      {!isRunning && (
        <Button size="lg" variant="secondary" onClick={reset} className="flex items-center justify-center gap-2">
          <RotateCcw size={20} />
          Resetar
        </Button>
      )}
      {isRunning && !isPaused && (
        <Button size="lg" variant="secondary" onClick={pause} className="flex items-center justify-center gap-2">
          <Pause size={20} />
          Pausar
        </Button>
      )}
      {isRunning && isPaused && (
        <Button size="lg" onClick={resume} className="flex items-center justify-center gap-2">
          <Play size={20} />
          Continuar
        </Button>
      )}
      {isRunning && (
        <Button size="lg" variant="danger" onClick={stop} className="aspect-square px-0 flex items-center justify-center">
          <Square size={20} />
        </Button>
      )}
    </div>
  );
}
