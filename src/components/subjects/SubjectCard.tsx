import { useState } from 'react';
import { BookOpen, EllipsisVertical, SquarePen, Trash2 } from 'lucide-react';
import type { Subject } from '../../types';
import Card from '../ui/Card';

interface SubjectCardProps {
  subject: Subject;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SubjectCard({ subject, onClick, onEdit, onDelete }: SubjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="relative group" onClick={onClick}>
      <div className="absolute top-0 left-0 right-0 h-2 rounded-t-lg" style={{ backgroundColor: subject.color }} />
      <div className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${subject.color}20` }}>
              <BookOpen size={24} style={{ color: subject.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{subject.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{subject.topicsCount || 0} tópicos</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <EllipsisVertical size={18} className="text-gray-600 dark:text-gray-400" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onEdit?.();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-gray-700 dark:text-gray-300"
                  >
                    <SquarePen size={16} />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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
        </div>

        {subject.description && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{subject.description}</p>}
      </div>
    </Card>
  );
}
