import { useState } from 'react';
import { EllipsisVertical, Network, SquarePen, Trash2 } from 'lucide-react';
import type { MindMap } from '../../types';
import Card from '../ui/Card';

interface MindMapCardProps {
  mindMap: MindMap;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MindMapCard({ mindMap, onClick, onEdit, onDelete }: MindMapCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="relative hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
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

      <div className="pr-16">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg">
            <Network size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-1">{mindMap.title}</h3>
            {mindMap.topicName && <p className="text-sm text-gray-600 dark:text-gray-400">📖 {mindMap.topicName}</p>}
          </div>
        </div>
        {mindMap.description && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{mindMap.description}</p>}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="font-medium">{mindMap.nodesCount || 0}</span>
            <span>nós</span>
          </div>
          <div>Criado em {new Date(mindMap.createdAt).toLocaleDateString('pt-BR')}</div>
        </div>
      </div>
    </Card>
  );
}
