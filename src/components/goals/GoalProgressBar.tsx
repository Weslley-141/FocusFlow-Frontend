import type { Goal } from '../../types';
import { formatMinutes, motivationalMessage, progressColor } from '../../utils/goals';

export default function GoalProgressBar({ goal }: { goal: Goal }) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {formatMinutes(goal.currentMinutes)} de {formatMinutes(goal.targetMinutes)}
          </span>
          <span className="font-bold text-gray-800 dark:text-gray-100">{goal.progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ease-out ${progressColor(goal.progress)}`}
            style={{ width: `${Math.min(goal.progress, 100)}%` }}
          >
            {goal.progress >= 15 && (
              <div className="h-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{goal.progress.toFixed(0)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">{motivationalMessage(goal)}</p>
    </div>
  );
}
