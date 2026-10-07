import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Topic, TopicInput } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { Alert, Button, Input, Modal, Textarea } from '../ui';

interface TopicFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TopicInput) => Promise<void>;
  topic?: Topic | null;
  subjectId: number;
  title?: string;
}

export default function TopicFormModal({ isOpen, onClose, onSubmit, topic, subjectId, title = 'Novo Tópico' }: TopicFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setDescription(topic.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [topic, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) {
      setError('O nome deve ter no mínimo 2 caracteres');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || undefined, subjectId });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error">{error}</Alert>}
        <Input label="Nome do tópico" placeholder="Ex: Derivadas" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
        <Textarea
          label="Descrição (opcional)"
          placeholder="Ex: Conceitos básicos de derivadas e suas aplicações"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={loading}
        />
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading} fullWidth>
            {topic ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
