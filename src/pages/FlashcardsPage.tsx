import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CirclePlay, Plus } from 'lucide-react';
import { flashcardService } from '../services/flashcardService';
import { subjectService } from '../services/subjectService';
import { topicService } from '../services/topicService';
import { getErrorMessage } from '../utils/error';
import type { Flashcard, FlashcardInput, FlashcardStats, Subject, Topic } from '../types';
import { Alert, Button, Spinner } from '../components/ui';
import FlashcardCard from '../components/flashcards/FlashcardCard';
import FlashcardFormModal from '../components/flashcards/FlashcardFormModal';
import FlashcardStatsCards from '../components/flashcards/FlashcardStatsCards';

export default function FlashcardsPage() {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [stats, setStats] = useState<FlashcardStats>({ totalCards: 0, dueForReview: 0, newCards: 0, masteredCards: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Flashcard | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<number | ''>('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [cards, subs, st] = await Promise.all([flashcardService.getAll(), subjectService.getAll(), flashcardService.getStats()]);
      setFlashcards(cards);
      setSubjects(subs);
      setStats(st);
      if (subs.length > 0) {
        const lists = await Promise.all(subs.map((s) => topicService.getBySubjectId(s.id)));
        setTopics(lists.flat());
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (data: FlashcardInput) => {
    const created = await flashcardService.create(data);
    setFlashcards([created, ...flashcards]);
    setStats(await flashcardService.getStats());
  };

  const handleUpdate = async (data: FlashcardInput) => {
    if (!editing) return;
    const updated = await flashcardService.update(editing.id, {
      front: data.front,
      back: data.back,
      subjectId: data.subjectId ?? null,
      topicId: data.topicId ?? null,
    });
    setFlashcards(flashcards.map((c) => (c.id === editing.id ? updated : c)));
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este flashcard?')) return;
    try {
      setDeletingId(id);
      await flashcardService.delete(id);
      setFlashcards(flashcards.filter((c) => c.id !== id));
      setStats(await flashcardService.getStats());
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (card: Flashcard) => {
    setEditing(card);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setEditing(null), 300);
  };

  const filtered = subjectFilter ? flashcards.filter((c) => c.subjectId === subjectFilter) : flashcards;

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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">🗂️ Meus Flashcards</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Sistema de repetição espaçada com algoritmo SM-2</p>
          </div>
          <div className="flex gap-3">
            {stats.dueForReview > 0 && (
              <Button variant="success" onClick={() => navigate('/flashcards/review')} className="flex items-center justify-center gap-2">
                <CirclePlay size={20} />
                Revisar ({stats.dueForReview})
              </Button>
            )}
            <Button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-2">
              <Plus size={20} />
              Novo Flashcard
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={load}>
              {error}. <button className="underline">Tentar novamente</button>
            </Alert>
          </div>
        )}

        <div className="mb-8">
          <FlashcardStatsCards stats={stats} />
        </div>

        {subjects.length > 0 && (
          <div className="mb-6 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por matéria:</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value ? Number(e.target.value) : '')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas as matérias</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {subjectFilter ? 'Nenhum flashcard nesta matéria' : 'Nenhum flashcard criado ainda'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Crie flashcards para começar a estudar com repetição espaçada</p>
            <Button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-2 mx-auto">
              <Plus size={20} />
              Criar Primeiro Flashcard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((card) => (
              <div key={card.id} className="relative">
                {deletingId === card.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
                    <Spinner />
                  </div>
                )}
                <FlashcardCard flashcard={card} onEdit={() => openEdit(card)} onDelete={() => handleDelete(card.id)} />
              </div>
            ))}
          </div>
        )}

        <FlashcardFormModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={editing ? handleUpdate : handleCreate}
          flashcard={editing}
          subjects={subjects}
          topics={topics}
          title={editing ? 'Editar Flashcard' : 'Novo Flashcard'}
        />
      </div>
    </div>
  );
}
