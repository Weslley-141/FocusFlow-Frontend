import type { ReactNode } from 'react';
import Card from './Card';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  onClick?: () => void;
}

const colors = {
  blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
  purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
  orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
  red: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
};

export default function StatCard({ icon, label, value, subtext, color = 'blue', onClick }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
          {subtext && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtext}</p>}
        </div>
      </div>
    </Card>
  );
}
