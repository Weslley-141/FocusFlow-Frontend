import { Award, BookOpen, Clock, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { FlashcardStats } from '../../types';
import Card from '../ui/Card';

function Item({ icon, label, value, color }: { icon: ReactNode; label: string; value: number; color: string }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold ${label === 'Total de Cards' ? 'text-gray-800 dark:text-gray-100' : ''}`}>{value}</p>
        </div>
      </div>
    </Card>
  );
}

export default function FlashcardStatsCards({ stats }: { stats: FlashcardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Item icon={<BookOpen size={24} />} label="Total de Cards" value={stats.totalCards} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
      <Item icon={<Clock size={24} />} label="Para Revisar Hoje" value={stats.dueForReview} color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" />
      <Item icon={<Sparkles size={24} />} label="Cards Novos" value={stats.newCards} color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" />
      <Item icon={<Award size={24} />} label="Dominados" value={stats.masteredCards} color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" />
    </div>
  );
}
