import { useState } from 'react';
import { pomodoroService } from '../services/pomodoroService';
import { usePomodoroStore } from '../stores/pomodoroStore';
import { usePomodoroTimer } from '../hooks/usePomodoroTimer';
import { getErrorMessage } from '../utils/error';
import { Alert, Card } from '../components/ui';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';
import PomodoroControls from '../components/pomodoro/PomodoroControls';
import PomodoroSettings from '../components/pomodoro/PomodoroSettings';

export default function PomodoroPage() {
  const { start, isRunning } = usePomodoroStore();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [error, setError] = useState('');

  usePomodoroTimer();

  const handleStart = async (duration: number, breakTime: number) => {
    try {
      const session = await pomodoroService.create({ duration, breakTime });
      setSessionId(session.id);
      start(duration, breakTime);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Chamado quando o foco termina: fecha a sessão no backend (atualiza as metas).
  const handleComplete = async () => {
    if (!sessionId) return;
    try {
      await pomodoroService.complete(sessionId, {});
      setSessionId(null);
      setError('');
      alert('✅ Sessão Pomodoro completada! O progresso das suas metas foi atualizado.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">⏱️ Timer Pomodoro</h1>
          <p className="text-gray-600 dark:text-gray-400">Use a técnica Pomodoro para manter o foco nos estudos</p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError('')}>
              {error}
            </Alert>
          </div>
        )}

        <div className="mb-8">
          <Card className="bg-gradient-to-br from-gray-50 dark:from-gray-800 to-white dark:to-gray-800">
            <PomodoroTimer />
            <div className="mt-8">
              <PomodoroControls onComplete={handleComplete} />
            </div>
          </Card>
        </div>

        <PomodoroSettings onStart={handleStart} />

        {!isRunning && (
          <div className="mt-8">
            <Card title="📚 Como funciona?">
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p><strong>1.</strong> Configure o tempo de foco e de pausa</p>
                <p><strong>2.</strong> Clique em "Iniciar Pomodoro"</p>
                <p><strong>3.</strong> Foque completamente durante o timer</p>
                <p><strong>4.</strong> Quando terminar, faça sua pausa!</p>
                <p><strong>5.</strong> O progresso das suas metas é atualizado automaticamente 🎯</p>
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 <strong>Dica:</strong> O método Pomodoro tradicional usa 25 minutos de foco com 5 minutos de pausa. Experimente e
                  ajuste conforme sua necessidade.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
