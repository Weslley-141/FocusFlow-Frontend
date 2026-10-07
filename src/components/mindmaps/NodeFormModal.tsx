import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { MindMapNode } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { Alert, Button, Input, Modal } from '../ui';

interface NodeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; parentId?: number }) => Promise<void>;
  availableParents: MindMapNode[];
  editingNode?: MindMapNode | null;
  title?: string;
}

export default function NodeFormModal({ isOpen, onClose, onSubmit, availableParents, editingNode, title = 'Novo Nó' }: NodeFormModalProps) {
  const [content, setContent] = useState('');
  const [parentId, setParentId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingNode) {
      setContent(editingNode.content);
      setParentId(editingNode.parentId || '');
    } else {
      setContent('');
      setParentId('');
    }
    setError('');
  }, [editingNode, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (content.trim().length < 2) {
      setError('O conteúdo deve ter no mínimo 2 caracteres');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ content: content.trim(), parentId: parentId || undefined });
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

        <Input label="Conteúdo do nó" placeholder="Ex: Conceito Principal" value={content} onChange={(e) => setContent(e.target.value)} required disabled={loading} />

        {!editingNode && availableParents.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nó pai (opcional)</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              disabled={loading}
            >
              <option value="">Nó raiz (sem pai)</option>
              {availableParents.map((n) => (
                <option key={n.id} value={n.id}>
                  {'\u00A0\u00A0'.repeat(n.level)}└─ {n.content}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Deixe vazio para criar um nó raiz</p>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Dica:</strong> Organize seus conceitos hierarquicamente. Conceitos gerais no topo, específicos embaixo!
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading} fullWidth>
            {editingNode ? 'Salvar' : 'Criar Nó'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
