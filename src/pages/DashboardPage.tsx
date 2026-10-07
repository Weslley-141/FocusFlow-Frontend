import { Award, BookOpen, Clock, FolderOpen, Target, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { Alert, Spinner, StatCard } from '../components/ui';
import QuickActions from '../components/dashboard/QuickActions';

const formatMinutes = (total: number) => {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
};

function Row({ label, value, valueClass }: { label: string; value: string | number; valueClass: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { stats, refetch } = useDashboardStats();

  if (stats.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Bem-vindo(a) de volta, {user?.name}! 👋</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Aqui está o resumo dos seus estudos</p>
        </div>

        {stats.error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => refetch()}>
              {stats.error}. <button className="underline">Tentar novamente</button>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Clock size={24} />} label="Tempo Estudado" value={formatMinutes(stats.pomodoro.totalMinutes)} subtext={`${stats.pomodoro.completedSessions} sessões completadas`} color="blue" />
          <StatCard icon={<BookOpen size={24} />} label="Flashcards" value={stats.flashcards.dueForReview} subtext={`${stats.flashcards.totalCards} cards no total`} color="green" />
          <StatCard icon={<Target size={24} />} label="Metas Ativas" value={stats.goals.activeGoals} subtext={`${stats.goals.completionRate}% de conclusão`} color="purple" />
          <StatCard icon={<FolderOpen size={24} />} label="Matérias" value={stats.subjects.activeSubjects} subtext={`${stats.subjects.totalSubjects} no total`} color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">⏱️ Sessões Pomodoro</h3>
            </div>
            <div className="space-y-3">
              <Row label="Total de sessões:" value={stats.pomodoro.totalSessions} valueClass="text-gray-800 dark:text-gray-100" />
              <Row label="Completadas:" value={stats.pomodoro.completedSessions} valueClass="text-green-600 dark:text-green-400" />
              <Row label="Tempo total:" value={formatMinutes(stats.pomodoro.totalMinutes)} valueClass="text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">🗂️ Flashcards</h3>
            </div>
            <div className="space-y-3">
              <Row label="Total de cards:" value={stats.flashcards.totalCards} valueClass="text-gray-800 dark:text-gray-100" />
              <Row label="Para revisar hoje:" value={stats.flashcards.dueForReview} valueClass="text-orange-600 dark:text-orange-400" />
              <Row label="Novos:" value={stats.flashcards.newCards} valueClass="text-blue-600 dark:text-blue-400" />
              <Row label="Dominados:" value={stats.flashcards.masteredCards} valueClass="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<TrendingUp size={24} />} label="Taxa de Conclusão" value={`${stats.goals.completionRate}%`} subtext="De metas completadas" color="green" />
          <StatCard icon={<Award size={24} />} label="Metas Concluídas" value={stats.goals.completedGoals} subtext={`De ${stats.goals.totalGoals} metas totais`} color="purple" />
          <StatCard icon={<Target size={24} />} label="Cards Dominados" value={stats.flashcards.masteredCards} subtext="Flashcards memorizados" color="orange" />
        </div>

        <QuickActions />

        {stats.pomodoro.completedSessions === 0 && stats.flashcards.totalCards === 0 && (
          <div className="mt-8 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 text-center">
            <p className="text-primary-800 dark:text-primary-300 font-medium mb-2">🎯 Pronto para começar sua jornada de estudos?</p>
            <p className="text-primary-600 dark:text-primary-400 text-sm">Comece criando suas matérias e organizando seus tópicos de estudo!</p>
          </div>
        )}
      </div>
    </div>
  );
}
