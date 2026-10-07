import { CircleCheckBig, CircleX, Clock, Target, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import type { GoalStats } from '../../types';
import { formatMinutes } from '../../utils/goals';
import Card from '../ui/Card';

function Item({ icon, label, value, iconClass, valueClass }: { icon: ReactNode; label: string; value: string | number; iconClass: string; valueClass: string }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${iconClass}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>
      </div>
    </Card>
  );
}

export default function GoalStatsCards({ stats }: { stats: GoalStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Item icon={<Target size={24} />} label="Total de Metas" value={stats.totalGoals} iconClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" valueClass="text-gray-800 dark:text-gray-100" />
      <Item icon={<CircleCheckBig size={24} />} label="Completadas" value={stats.completedGoals} iconClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" valueClass="text-green-600 dark:text-green-400" />
      <Item icon={<TrendingUp size={24} />} label="Ativas" value={stats.activeGoals} iconClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" valueClass="text-orange-600 dark:text-orange-400" />
      <Item icon={<CircleX size={24} />} label="Falhadas" value={stats.failedGoals} iconClass="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" valueClass="text-red-600 dark:text-red-400" />
      <Item icon={<Clock size={24} />} label="Tempo Total" value={formatMinutes(stats.totalMinutesCompleted)} iconClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" valueClass="text-xl text-purple-600 dark:text-purple-400" />
    </div>
  );
}
