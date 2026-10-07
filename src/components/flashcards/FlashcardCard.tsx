import { useState } from 'react';
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react';
import type { Flashcard } from '../../types';

interface FlashcardCardProps {
  flashcard: Flashcard;
  showAnswer?: boolean;
  onToggleAnswer?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isReviewMode?: boolean;
}

export default function FlashcardCard({
  flashcard,
  showAnswer = false,
  onToggleAnswer,
  onEdit,
  onDelete,
  isReviewMode = false,
}: FlashcardCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const nextReview = flashcard.nextReviewDate ? new Date(flashcard.nextReviewDate) : null;
  const needsReview = !!nextReview && nextReview < new Date() && flashcard.interval > 0;
  const color = flashcard.subjectColor || '#6B7280';
  const isFlipped = isReviewMode ? showAnswer : flipped;

  const handleClick = () => {
    if (isReviewMode) onToggleAnswer?.();
    else setFlipped((f) => !f);
  };

  return (
    <div className="relative" style={{ perspective: '1000px', minHeight: '260px' }}>
      <div
        onClick={handleClick}
        className="relative w-full h-full cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '260px',
        }}
      >
        {/* Frente */}
        <div
          className="absolute inset-0 rounded-xl shadow-md flex flex-col overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="px-4 pt-4 pb-8 flex flex-col gap-2" style={{ backgroundColor: color }}>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {flashcard.repetitions === 0 && (
                  <span className="px-2 py-0.5 bg-white bg-opacity-20 text-white text-xs font-medium rounded-full">✨ Novo</span>
                )}
                {needsReview && (
                  <span className="px-2 py-0.5 bg-white bg-opacity-20 text-white text-xs font-medium rounded-full">⏰ Revisar</span>
                )}
                {flashcard.repetitions >= 5 && (
                  <span className="px-2 py-0.5 bg-white bg-opacity-20 text-white text-xs font-medium rounded-full">🏆 Dominado</span>
                )}
              </div>

              {!isReviewMode && (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                    <EllipsisVertical size={18} className="text-white" />
                  </button>
                  {menuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            onEdit?.();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-gray-700 dark:text-gray-300"
                        >
                          <SquarePen size={16} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            onDelete?.();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-left"
                        >
                          <Trash2 size={16} />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-white text-opacity-75 font-medium uppercase tracking-wider mt-1">Frente</p>
          </div>

          <div className="flex-1 bg-white dark:bg-gray-800 rounded-b-xl px-5 py-4 flex flex-col justify-between -mt-4 relative">
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800"
              style={{ backgroundColor: color }}
            />
            <p className="text-center text-gray-800 dark:text-gray-100 font-medium text-base mt-4 whitespace-pre-wrap">{flashcard.front}</p>
            <div className="mt-4 flex items-center justify-between">
              {flashcard.subjectName && (
                <span className="px-2 py-0.5 rounded-full text-white text-xs font-medium" style={{ backgroundColor: color }}>
                  {flashcard.subjectName}
                </span>
              )}
              {!isReviewMode && <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">Clique para ver o verso →</span>}
            </div>
          </div>
        </div>

        {/* Verso */}
        <div
          className="absolute inset-0 rounded-xl shadow-md flex flex-col overflow-visible"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="px-4 pt-4 pb-8 flex flex-col gap-2 bg-white dark:bg-gray-800" style={{ borderTop: `4px solid ${color}` }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color }}>
                Verso
              </p>
              {!isReviewMode && <span className="text-xs text-gray-400 dark:text-gray-500">← Clique para voltar</span>}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-b-xl px-5 py-4 flex flex-col justify-between -mt-4">
            <p className="text-center text-gray-800 dark:text-gray-100 font-medium text-base mt-2 whitespace-pre-wrap break-words">
              {flashcard.back}
            </p>
            {!isReviewMode && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                {flashcard.topicName && (
                  <div>
                    <span className="font-medium">Tópico:</span> {flashcard.topicName}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <span>
                      <span className="font-medium">Revisões:</span> {flashcard.repetitions}
                    </span>
                    <span>
                      <span className="font-medium">Facilidade:</span> {flashcard.easeFactor.toFixed(2)}
                    </span>
                  </div>
                  {nextReview && <span>Revisão: 📅 {nextReview.toLocaleDateString('pt-BR')}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isReviewMode && onToggleAnswer && (
        <div className="mt-3">
          <button
            onClick={onToggleAnswer}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            {showAnswer ? 'Ocultar Resposta' : 'Mostrar Resposta'}
          </button>
        </div>
      )}
    </div>
  );
}
