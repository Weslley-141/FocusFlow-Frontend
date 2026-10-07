import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Check } from 'lucide-react';
import type { Subject, SubjectInput } from '../../types';
import { SUBJECT_COLORS } from '../../utils/colors';
import { getErrorMessage } from '../../utils/error';
import { Alert, Button, Input, Modal, Textarea } from '../ui';

interface SubjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectInput) => Promise<void>;
  subject?: Subject | null;
  title?: string;
}

export default function SubjectFormModal({ isOpen, onClose, onSubmit, subject, title = 'Nova Matéria' }: SubjectFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(SUBJECT_COLORS[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setDescription(subject.description || '');
      setColor(subject.color);
    } else {
      setName('');
      setDescription('');
      setColor(SUBJECT_COLORS[0].value);
    }
    setError('');
  }, [subject, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) {
      setError('O nome deve ter no mínimo 2 caracteres');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || undefined, color });
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

        <Input label="Nome da matéria" placeholder="Ex: Matemática" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
        <Textarea
          label="Descrição (opcional)"
          placeholder="Ex: Cálculo diferencial e integral"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={loading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor da matéria</label>
          <div className="grid grid-cols-5 gap-3">
            {SUBJECT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`h-12 rounded-lg border-2 transition-all relative ${
                  color === c.value ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: c.value }}
                disabled={loading}
              >
                {color === c.value && <Check size={20} className="text-white absolute inset-0 m-auto" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading} fullWidth>
            {subject ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
