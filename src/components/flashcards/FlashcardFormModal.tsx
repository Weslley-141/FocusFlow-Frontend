import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Flashcard, FlashcardInput, Subject, Topic } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { Alert, Button, Modal, Textarea } from '../ui';

interface FlashcardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FlashcardInput) => Promise<void>;
  flashcard?: Flashcard | null;
  subjects?: Subject[];
  topics?: Topic[];
  title?: string;
}

const selectClass =
  'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50';

export default function FlashcardFormModal({
  isOpen,
  onClose,
  onSubmit,
  flashcard,
  subjects = [],
  topics = [],
  title = 'Novo Flashcard',
}: FlashcardFormModalProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [topicId, setTopicId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (flashcard) {
      setFront(flashcard.front);
      setBack(flashcard.back);
      setSubjectId(flashcard.subjectId || '');
      setTopicId(flashcard.topicId || '');
    } else {
      setFront('');
      setBack('');
      setSubjectId('');
      setTopicId('');
    }
    setError('');
  }, [flashcard, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (front.trim().length < 2) {
      setError('A frente do card deve ter no mínimo 2 caracteres');
      return;
    }
    if (back.trim().length < 2) {
      setError('O verso do card deve ter no mínimo 2 caracteres');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        front: front.trim(),
        back: back.trim(),
        subjectId: subjectId || undefined,
        topicId: topicId || undefined,
      });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = subjectId ? topics.filter((t) => t.subjectId === subjectId) : topics;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error">{error}</Alert>}

        <Textarea
          label="Frente do card (pergunta)"
          placeholder="Ex: O que é uma derivada?"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          required
          rows={3}
          disabled={loading}
        />
        <Textarea
          label="Verso do card (resposta)"
          placeholder="Ex: Taxa de variação instantânea de uma função..."
          value={back}
          onChange={(e) => setBack(e.target.value)}
          required
          rows={4}
          disabled={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matéria (opcional)</label>
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value ? Number(e.target.value) : '');
                setTopicId('');
              }}
              className={selectClass}
              disabled={loading}
            >
              <option value="">Nenhuma</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tópico (opcional)</label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value ? Number(e.target.value) : '')}
              className={selectClass}
              disabled={loading || !subjectId}
            >
              <option value="">Nenhum</option>
              {filteredTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading} fullWidth>
            {flashcard ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
