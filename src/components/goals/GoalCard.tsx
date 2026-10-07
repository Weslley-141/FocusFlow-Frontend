import { useState } from 'react';
import { Calendar, EllipsisVertical, SquarePen, Target, Trash2, TrendingUp } from 'lucide-react';
import type { Goal } from '../../types';
import { daysRemaining, formatDate, goalStatusInfo, goalTypeLabel, isGoalOpen } from '../../utils/goals';
import Card from '../ui/Card';
import GoalProgressBar from './GoalProgressBar';

interface GoalCardProps {
  goal: Goal;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddProgress?: () => void;
}

const itemClass = 'w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-gray-700 dark:text-gray-300';

export default function GoalCard({ goal, onEdit, onDelete, onAddProgress }: GoalCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = goalStatusInfo(goal.status);
  const days = daysRemaining(goal.endDate);
  const open = isGoalOpen(goal.status);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 ${status.bgColor} ${status.color} text-xs font-medium rounded-full`}>{status.label}</span>

        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <EllipsisVertical size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                {open && onAddProgress && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onAddProgress();
                    }}
                    className={itemClass}
                  >
                    <TrendingUp size={16} />
                    <span>Adicionar Progresso</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit?.();
                  }}
                  className={itemClass}
                >
                  <SquarePen size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-left"
                >
                  <Trash2 size={16} />
                  <span>Excluir</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
          <Target size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-1">{goal.title}</h3>
          {goal.description && <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>}
        </div>
      </div>

      <GoalProgressBar goal={goal} />

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span className="font-medium">Tipo:</span>
          <span>{goalTypeLabel(goal.type)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span className="font-medium">Período:</span>
          <span>
            {formatDate(goal.startDate)} até {formatDate(goal.endDate)}
          </span>
        </div>
        {days >= 0 && open && (
          <div className="flex items-center gap-2">
            <span className="font-medium">⏰ Dias restantes:</span>
            <span className="font-bold text-primary-600 dark:text-primary-400">{days}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
