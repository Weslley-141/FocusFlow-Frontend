import { useState } from 'react';
import { Play } from 'lucide-react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { Alert, Button, Card, Input } from '../ui';

interface PomodoroSettingsProps {
  onStart: (duration: number, breakTime: number) => void;
}

const PRESETS = [
  { label: 'Clássico (25/5)', duration: 25, breakTime: 5 },
  { label: 'Longo (50/10)', duration: 50, breakTime: 10 },
  { label: 'Rápido (15/3)', duration: 15, breakTime: 3 },
];

export default function PomodoroSettings({ onStart }: PomodoroSettingsProps) {
  const { isRunning } = usePomodoroStore();
  const [duration, setDuration] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [error, setError] = useState('');

  if (isRunning) return null;

  const handleStart = () => {
    setError('');
    if (duration < 1 || duration > 120) {
      setError('Duração deve ser entre 1 e 120 minutos');
      return;
    }
    if (breakTime < 0 || breakTime > 60) {
      setError('Tempo de pausa deve ser entre 0 e 60 minutos');
      return;
    }
    onStart(duration, breakTime);
  };

  return (
    <Card title="⚙️ Configurar Pomodoro">
      {error && (
        <div className="mb-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Duração (minutos)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min={1}
          max={120}
          helperText="Entre 1 e 120 minutos"
        />
        <Input
          label="Pausa (minutos)"
          type="number"
          value={breakTime}
          onChange={(e) => setBreakTime(Number(e.target.value))}
          min={0}
          max={60}
          helperText="Entre 0 e 60 minutos"
        />
      </div>

      <div className="mt-6">
        <Button onClick={handleStart} size="lg" fullWidth className="flex items-center justify-center gap-2">
          <Play size={20} />
          Iniciar Pomodoro
        </Button>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">⚡ Atalhos rápidos:</p>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setDuration(p.duration);
                setBreakTime(p.breakTime);
              }}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
