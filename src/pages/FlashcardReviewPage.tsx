import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CircleCheckBig } from 'lucide-react';
import { flashcardService } from '../services/flashcardService';
import { getErrorMessage } from '../utils/error';
import type { Flashcard } from '../types';
import { Alert, Button, Card, Spinner } from '../components/ui';
import FlashcardCard from '../components/flashcards/FlashcardCard';
import ReviewButtons from '../components/flashcards/ReviewButtons';

export default function FlashcardReviewPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState('');
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        setCards(await flashcardService.getDueForReview());
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleReview = async (quality: number) => {
    const card = cards[index];
    if (!card || reviewing) return;
    try {
      setReviewing(true);
      setError('');
      await flashcardService.review(card.id, { quality });
      setReviewedCount((n) => n + 1);
      if (index < cards.length - 1) {
        setIndex(index + 1);
        setShowAnswer(false);
      } else {
        setIndex(0);
        setCards([]);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setReviewing(false);
    }
  };

  const current = cards[index];
  const total = cards.length;
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/flashcards')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Voltar para flashcards</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">🎯 Sessão de Revisão</h1>
          <p className="text-gray-600 dark:text-gray-400">Use o algoritmo SM-2 para memorizar melhor</p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError('')}>
              {error}
            </Alert>
          </div>
        )}

        {total > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progresso: {index + 1} de {total}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{reviewedCount} revisados</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {current ? (
          <div className="space-y-6">
            <FlashcardCard flashcard={current} showAnswer={showAnswer} onToggleAnswer={() => setShowAnswer(!showAnswer)} isReviewMode />
            {showAnswer && (
              <div className="space-y-4">
                <p className="text-center text-gray-700 dark:text-gray-300 font-medium">Como foi sua resposta?</p>
                <ReviewButtons onReview={handleReview} disabled={reviewing} />
              </div>
            )}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <CircleCheckBig size={64} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">🎉 Parabéns!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Você revisou {reviewedCount} flashcard{reviewedCount !== 1 ? 's' : ''}!
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  O algoritmo SM-2 calculou automaticamente quando você deve revisar cada card novamente.
                </p>
                <Button onClick={() => navigate('/flashcards')} size="lg">
                  Voltar para Flashcards
                </Button>
              </div>
            </div>
          </Card>
        )}

        {current && (
          <div className="mt-8">
            <Card>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p className="font-semibold text-gray-800 dark:text-gray-100">💡 Como funciona o algoritmo SM-2:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li><strong>Novamente:</strong> Volta para 1 dia</li>
                  <li><strong>Difícil:</strong> Intervalo menor, revisão mais frequente</li>
                  <li><strong>Bom:</strong> Intervalo aumenta moderadamente</li>
                  <li><strong>Fácil:</strong> Intervalo aumenta muito, revisão mais espaçada</li>
                </ul>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
