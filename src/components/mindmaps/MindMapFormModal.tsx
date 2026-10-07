import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { MindMapInput, Topic } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { Alert, Button, Input, Modal, Textarea } from '../ui';

export type TopicWithSubject = Topic & { subjectName?: string };

interface MindMapFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MindMapInput) => Promise<void>;
  topics: TopicWithSubject[];
  title?: string;
}

export default function MindMapFormModal({ isOpen, onClose, onSubmit, topics, title = 'Novo Mapa Mental' }: MindMapFormModalProps) {
  const [mapTitle, setMapTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topicId, setTopicId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMapTitle('');
    setDescription('');
    setTopicId('');
    setError('');
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (mapTitle.trim().length < 3) {
      setError('O título deve ter no mínimo 3 caracteres');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ title: mapTitle.trim(), description: description.trim() || undefined, topicId: topicId || undefined });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Agrupa os tópicos por matéria no <select>.
  const grouped = topics.reduce<Record<string, TopicWithSubject[]>>((acc, t) => {
    const key = t.subjectName || 'Sem matéria';
    (acc[key] ||= []).push(t);
    return acc;
  }, {});

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          label="Título do mapa mental"
          placeholder="Ex: Cálculo Diferencial"
          value={mapTitle}
          onChange={(e) => setMapTitle(e.target.value)}
          required
          disabled={loading}
        />
        <Textarea
          label="Descrição (opcional)"
          placeholder="Ex: Conceitos principais de derivadas e aplicações"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          disabled={loading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tópico (opcional)</label>
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            disabled={loading}
          >
            <option value="">Nenhum</option>
            {Object.entries(grouped).map(([subject, list]) => (
              <optgroup key={subject} label={subject}>
                {list.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {topics.length === 0 && <p className="text-xs text-gray-400 mt-1">Nenhum tópico cadastrado ainda. Crie tópicos em Matérias.</p>}
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <p className="text-sm text-purple-800 dark:text-purple-300">
            🧠 <strong>Dica:</strong> Após criar o mapa, você poderá adicionar nós para organizar conceitos hierarquicamente!
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading} fullWidth>
            Criar Mapa
          </Button>
        </div>
      </form>
    </Modal>
  );
}
