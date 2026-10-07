import type { Goal, GoalStatus, GoalType } from '../types';

export function goalTypeLabel(type: GoalType): string {
  return { daily: '📅 Diária', weekly: '📆 Semanal', monthly: '🗓️ Mensal', custom: '⚙️ Personalizada' }[type];
}

export function goalStatusInfo(status: GoalStatus) {
  const info: Record<GoalStatus, { label: string; color: string; bgColor: string }> = {
    pending: { label: '⏳ Pendente', color: 'text-gray-600', bgColor: 'bg-gray-100' },
    in_progress: { label: '🔥 Em Progresso', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    active: { label: '🔥 Em Progresso', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    completed: { label: '✅ Completada', color: 'text-green-600', bgColor: 'bg-green-100' },
    failed: { label: '❌ Falhada', color: 'text-red-600', bgColor: 'bg-red-100' },
  };
  return info[status];
}

export const isGoalOpen = (status: GoalStatus) => status !== 'completed' && status !== 'failed';

/** Formata a parte de data (YYYY-MM-DD) de um ISO sem sofrer deslocamento de fuso. */
export function formatDate(iso: string): string {
  return new Date(`${iso.split('T')[0]}T12:00:00`).toLocaleDateString('pt-BR');
}

/** Dias entre hoje e a data final (negativo = prazo vencido). */
export function daysRemaining(endIso: string): number {
  const end = new Date(`${endIso.split('T')[0]}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

export function progressColor(progress: number): string {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  if (progress >= 25) return 'bg-orange-500';
  return 'bg-red-500';
}

export function motivationalMessage(goal: Goal): string {
  const days = daysRemaining(goal.endDate);
  if (goal.status === 'completed') return '🎉 Meta completada! Parabéns!';
  if (goal.status === 'failed') return '😔 Meta não completada. Tente novamente!';
  if (days < 0) return '⏰ Prazo expirado!';
  if (days === 0) return '🔥 Último dia! Você consegue!';
  if (days === 1) return '⚡ 1 dia restante! Falta pouco!';
  if (goal.progress >= 100) return '🎯 Meta atingida! Complete para finalizar!';
  if (goal.progress >= 75) return `💪 ${days} dias restantes. Quase lá!`;
  if (goal.progress >= 50) return `🚀 ${days} dias restantes. Continue assim!`;
  return `📈 ${days} dias restantes. Vamos lá!`;
}
