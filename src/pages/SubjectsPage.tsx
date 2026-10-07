import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus } from 'lucide-react';
import { subjectService } from '../services/subjectService';
import { useSubjectStore } from '../stores/subjectStore';
import { getErrorMessage } from '../utils/error';
import type { Subject, SubjectInput } from '../types';
import { Alert, Button, Spinner } from '../components/ui';
import SubjectCard from '../components/subjects/SubjectCard';
import SubjectFormModal from '../components/subjects/SubjectFormModal';

export default function SubjectsPage() {
  const navigate = useNavigate();
  const { subjects, fetchSubjects, addSubject, updateSubject, removeSubject } = useSubjectStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      await fetchSubjects();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (data: SubjectInput) => {
    addSubject(await subjectService.create(data));
  };

  const handleUpdate = async (data: SubjectInput) => {
    if (!editing) return;
    const updated = await subjectService.update(editing.id, data);
    updateSubject(editing.id, updated);
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta matéria?')) return;
    try {
      setDeletingId(id);
      await subjectService.delete(id);
      removeSubject(id);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (subject: Subject) => {
    setEditing(subject);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setEditing(null), 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">📚 Minhas Matérias</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Organize seus tópicos de estudo por matéria</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-2">
            <Plus size={20} />
            Nova Matéria
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={load}>
              {error}. <button className="underline">Tentar novamente</button>
            </Alert>
          </div>
        )}

        {subjects.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Nenhuma matéria criada ainda</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Comece criando sua primeira matéria para organizar seus estudos</p>
            <Button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-2 mx-auto">
              <Plus size={20} />
              Criar Primeira Matéria
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div key={subject.id} className="relative">
                {deletingId === subject.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <Spinner />
                  </div>
                )}
                <SubjectCard
                  subject={subject}
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                  onEdit={() => openEdit(subject)}
                  onDelete={() => handleDelete(subject.id)}
                />
              </div>
            ))}
          </div>
        )}

        <SubjectFormModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={editing ? handleUpdate : handleCreate}
          subject={editing}
          title={editing ? 'Editar Matéria' : 'Nova Matéria'}
        />
      </div>
    </div>
  );
}
