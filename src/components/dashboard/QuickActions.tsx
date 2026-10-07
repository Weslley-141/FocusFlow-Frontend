import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, FolderOpen, Network, Target } from 'lucide-react';
import Card from '../ui/Card';

export default function QuickActions() {
  const navigate = useNavigate();
  const actions = [
    { icon: <Clock size={24} />, label: 'Iniciar Pomodoro', color: 'bg-blue-500 hover:bg-blue-600', path: '/pomodoro' },
    { icon: <BookOpen size={24} />, label: 'Estudar Flashcards', color: 'bg-green-500 hover:bg-green-600', path: '/flashcards' },
    { icon: <Network size={24} />, label: 'Mapas Mentais', color: 'bg-purple-500 hover:bg-purple-600', path: '/mindmaps' },
    { icon: <Target size={24} />, label: 'Ver Metas', color: 'bg-red-500 hover:bg-red-600', path: '/goals' },
    { icon: <FolderOpen size={24} />, label: 'Minhas Matérias', color: 'bg-indigo-500 hover:bg-indigo-600', path: '/subjects' },
  ];

  return (
    <Card title="🚀 Ações Rápidas">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((a) => (
          <button
            key={a.path}
            onClick={() => navigate(a.path)}
            className={`${a.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-2`}
          >
            {a.icon}
            <span className="text-sm font-medium">{a.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
