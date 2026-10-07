import { useEffect, useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { goalService } from '../services/goalService';
import { getErrorMessage } from '../utils/error';
import type { Goal, GoalInput, GoalStats } from '../types';
import { Alert, Button, Input, Modal, Spinner } from '../components/ui';
import GoalCard from '../components/goals/GoalCard';
import GoalFormModal from '../components/goals/GoalFormModal';
import GoalStatsCards from '../components/goals/GoalStatsCards';

type Filter = 'all' | 'active' | 'completed' | 'failed';

const emptyStats: GoalStats = {
  totalGoals: 0,
  completedGoals: 0,
  failedGoals: 0,
  activeGoals: 0,
  totalMinutesCompleted: 0,
  completionRate: 0,
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<GoalStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressGoalId, setProgressGoalId] = useState<number | null>(null);
  const [minutes, setMinutes] = useState(30);
  const [savingProgress, setSavingProgress] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [list, st] = await Promise.all([goalService.getAll(), goalService.getStats()]);
      setGoals(list);
      setStats(st);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const refreshStats = async () => setStats(await goalService.getStats());

  const handleCreate = async (data: GoalInput) => {
    const created = await goalService.create(data);
    setGoals([created, ...goals]);
    await refreshStats();
  };

  const handleUpdate = async (data: GoalInput) => {
    if (!editing) return;
    const updated = await goalService.update(editing.id, {
      title: data.title,
      description: data.description,
      targetMinutes: data.targetMinutes,
    });
    setGoals(goals.map((g) => (g.id === editing.id ? updated : g)));
    setEditing(null);
    await refreshStats();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta meta?')) return;
    try {
      setDeletingId(id);
      await goalService.delete(id);
      setGoals(goals.filter((g) => g.id !== id));
      await refreshStats();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (goal: Goal) => {
    setEditing(goal);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setEditing(null), 300);
  };

  const openProgress = (id: number) => {
    setProgressGoalId(id);
    setProgressOpen(true);
  };

  const closeProgress = () => {
    setProgressOpen(false);
    setProgressGoalId(null);
  };

  const handleAddProgress = async () => {
    if (!progressGoalId) return;
    try {
      setSavingProgress(true);
      const updated = await goalService.updateProgress(progressGoalId, { minutesToAdd: minutes });
      setGoals(goals.map((g) => (g.id === progressGoalId ? updated : g)));
      closeProgress();
      setMinutes(30);
      await refreshStats();
      if (updated.status === 'completed') alert('🎉 Parabéns! Meta completada!');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSavingProgress(false);
    }
  };

  const filtered = goals.filter((g) => {
    if (filter === 'all') return true;
    if (filter === 'active') return g.status === 'active' || g.status === 'pending' || g.status === 'in_progress';
    return g.status === filter;
  });

  const filterButton = (value: Filter, label: string) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        filter === value
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">🎯 Minhas Metas</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Acompanhe seu progresso e conquiste seus objetivos!</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-2">
            <Plus size={20} className="mr-2" />
            Nova Meta
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={load}>
              {error}. <button className="underline">Tentar novamente</button>
            </Alert>
          </div>
        )}

        <div className="mb-8">
          <GoalStatsCards stats={stats} />
        </div>

        {stats.totalGoals > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Taxa de Conclusão</p>
                  <p className="text-4xl font-bold">{stats.completionRate.toFixed(1)}%</p>
                </div>
                <div className="text-6xl">🏆</div>
              </div>
              <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${stats.completionRate}%` }} />
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center gap-3 flex-wrap">
          {filterButton('all', 'Todas')}
          {filterButton('active', `Ativas (${stats.activeGoals})`)}
          {filterButton('completed', `Completadas (${stats.completedGoals})`)}
          {filterButton('failed', `Falhadas (${stats.failedGoals})`)}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Target size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {filter === 'all'
                ? 'Nenhuma meta criada ainda'
                : `Nenhuma meta ${filter === 'active' ? 'ativa' : filter === 'completed' ? 'completada' : 'falhada'}`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Crie metas para acompanhar seu progresso nos estudos</p>
            <Button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-1 mx-auto">
              <Plus size={20} className="mr-2" />
              Criar Primeira Meta
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((goal) => (
              <div key={goal.id} className="relative">
                {deletingId === goal.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <Spinner />
                  </div>
                )}
                <GoalCard goal={goal} onEdit={() => openEdit(goal)} onDelete={() => handleDelete(goal.id)} onAddProgress={() => openProgress(goal.id)} />
              </div>
            ))}
          </div>
        )}

        <GoalFormModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={editing ? handleUpdate : handleCreate}
          goal={editing}
          title={editing ? 'Editar Meta' : 'Nova Meta'}
        />

        <Modal isOpen={progressOpen} onClose={closeProgress} title="➕ Adicionar Progresso">
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">Quanto tempo você estudou? Adicione os minutos ao progresso da sua meta!</p>
            <Input
              label="Minutos estudados"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              min={1}
              disabled={savingProgress}
            />
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>Dica:</strong> Você também pode adicionar progresso automaticamente ao completar sessões Pomodoro!
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={closeProgress} disabled={savingProgress} fullWidth>
                Cancelar
              </Button>
              <Button onClick={handleAddProgress} isLoading={savingProgress} fullWidth>
                Adicionar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
