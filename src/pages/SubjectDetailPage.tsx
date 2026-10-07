import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus } from 'lucide-react';
import { subjectService } from '../services/subjectService';
import { topicService } from '../services/topicService';
import { useSubjectStore } from '../stores/subjectStore';
import { getErrorMessage } from '../utils/error';
import type { Subject, Topic, TopicInput } from '../types';
import { Alert, Button, Card, Spinner } from '../components/ui';
import TopicCard from '../components/topics/TopicCard';
import TopicFormModal from '../components/topics/TopicFormModal';

export default function SubjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSubjects } = useSubjectStore();
  const subjectId = Number(id);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [s, t] = await Promise.all([subjectService.getById(subjectId), topicService.getBySubjectId(subjectId)]);
      setSubject(s);
      setTopics(t);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCreate = async (data: TopicInput) => {
    const created = await topicService.create(data);
    setTopics([...topics, created]);
    await fetchSubjects(); // atualiza o contador de tópicos da listagem
  };

  const handleUpdate = async (data: TopicInput) => {
    if (!editing) return;
    const updated = await topicService.update(editing.id, data);
    setTopics(topics.map((t) => (t.id === editing.id ? updated : t)));
    setEditing(null);
  };

  const handleDelete = async (topicId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este tópico?')) return;
    try {
      setDeletingId(topicId);
      await topicService.delete(topicId);
      setTopics(topics.filter((t) => t.id !== topicId));
      await fetchSubjects();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (topic: Topic) => {
    setEditing(topic);
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

  if (!subject) {
    return (
      <div className="p-8">
        <Alert type="error">Matéria não encontrada</Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/subjects')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Voltar para matérias</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${subject.color}20` }}>
              <BookOpen size={32} style={{ color: subject.color }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{subject.name}</h1>
              {subject.description && <p className="text-gray-600 dark:text-gray-400 mt-1">{subject.description}</p>}
            </div>
          </div>
          <Button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-2">
            <Plus size={20} />
            Novo Tópico
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={load}>
              {error}. <button className="underline">Tentar novamente</button>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Tópicos</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{topics.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tópicos Ativos</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{topics.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400">Cor da Matéria</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded" style={{ backgroundColor: subject.color }} />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{subject.color}</span>
            </div>
          </Card>
        </div>

        {topics.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Nenhum tópico criado ainda</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Adicione tópicos para organizar o conteúdo desta matéria</p>
              <Button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-2 mx-auto">
                <Plus size={20} />
                Criar Primeiro Tópico
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">📖 Tópicos ({topics.length})</h2>
            {topics.map((topic) => (
              <div key={topic.id} className="relative">
                {deletingId === topic.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <Spinner />
                  </div>
                )}
                <TopicCard topic={topic} onEdit={() => openEdit(topic)} onDelete={() => handleDelete(topic.id)} />
              </div>
            ))}
          </div>
        )}

        <TopicFormModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={editing ? handleUpdate : handleCreate}
          topic={editing}
          subjectId={subjectId}
          title={editing ? 'Editar Tópico' : 'Novo Tópico'}
        />
      </div>
    </div>
  );
}
