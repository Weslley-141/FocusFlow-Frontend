import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Goal, GoalInput, GoalType } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { Alert, Button, Input, Modal, Textarea } from '../ui';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalInput) => Promise<void>;
  goal?: Goal | null;
  title?: string;
}

const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const emptyForm = () => ({
  title: '',
  description: '',
  type: 'daily' as GoalType,
  targetMinutes: 120,
  startDate: todayLocal(),
  endDate: todayLocal(),
});

export default function GoalFormModal({ isOpen, onClose, onSubmit, goal, title = 'Nova Meta' }: GoalFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal) {
      setForm({
        title: goal.title,
        description: goal.description || '',
        type: goal.type,
        targetMinutes: goal.targetMinutes,
        startDate: goal.startDate.split('T')[0],
        endDate: goal.endDate.split('T')[0],
      });
    } else {
      setForm(emptyForm());
    }
    setError('');
  }, [goal, isOpen]);

  // Ao criar: semanal = início + 6 dias; mensal = até o dia anterior do próximo mês; diária = mesmo dia.
  useEffect(() => {
    if (goal || !form.startDate || form.type === 'custom') return;
    const start = new Date(`${form.startDate}T12:00:00`);
    const end = new Date(start);
    if (form.type === 'weekly') {
      end.setDate(start.getDate() + 6);
    } else if (form.type === 'monthly') {
      end.setMonth(start.getMonth() + 1);
      end.setDate(end.getDate() - 1);
    }
    setForm((f) => ({ ...f, endDate: end.toISOString().split('T')[0] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.type, form.startDate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.title.trim().length < 3) {
      setError('O título deve ter no mínimo 3 caracteres');
      return;
    }
    if (form.targetMinutes <= 0) {
      setError('A meta de minutos deve ser maior que zero');
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('A data final deve ser posterior à data inicial');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        targetMinutes: form.targetMinutes,
        startDate: form.startDate,
        endDate: form.endDate,
      });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          label="Título da meta"
          placeholder="Ex: Estudar 2 horas por dia"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          disabled={loading}
        />
        <Textarea
          label="Descrição (opcional)"
          placeholder="Ex: Focar em matemática e física"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          disabled={loading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de meta</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as GoalType })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            disabled={loading || !!goal}
          >
            <option value="daily">📅 Diária</option>
            <option value="weekly">📆 Semanal</option>
            <option value="monthly">🗓️ Mensal</option>
            <option value="custom">⚙️ Personalizada</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta de tempo</label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={form.targetMinutes}
              onChange={(e) => setForm({ ...form, targetMinutes: Number(e.target.value) })}
              min={1}
              required
              disabled={loading}
            />
            <span className="text-gray-600 dark:text-gray-400">minutos</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {form.targetMinutes >= 60
              ? `≈ ${Math.floor(form.targetMinutes / 60)}h ${form.targetMinutes % 60}min`
              : `${form.targetMinutes} minutos`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data de início"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
            disabled={loading || !!goal}
          />
          <Input
            label="Data final"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
            disabled={loading || !!goal || form.type === 'weekly' || form.type === 'monthly'}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading} fullWidth>
            {goal ? 'Salvar' : 'Criar Meta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
