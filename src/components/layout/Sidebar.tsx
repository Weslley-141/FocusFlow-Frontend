import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  FolderOpen,
  House,
  LogOut,
  Moon,
  Network,
  Sun,
  Target,
  BookOpen,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { usePomodoroStore } from '../../stores/pomodoroStore';

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const { isRunning } = usePomodoroStore();
  const [collapsed, setCollapsed] = useState(true);

  const items = [
    { icon: <House size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FolderOpen size={20} />, label: 'Matérias', path: '/subjects' },
    { icon: <Clock size={20} />, label: 'Pomodoro', path: '/pomodoro' },
    { icon: <BookOpen size={20} />, label: 'Flashcards', path: '/flashcards' },
    { icon: <Network size={20} />, label: 'Mapas Mentais', path: '/mindmaps' },
    { icon: <Target size={20} />, label: 'Metas', path: '/goals' },
  ];

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    onToggle?.(next);
  };

  const handleLogout = () => {
    if (isRunning) {
      alert('⏱️ O timer está ativo! Pare o Pomodoro antes de sair.');
      return;
    }
    logout();
    navigate('/login');
  };

  const go = (path: string) => {
    if (isRunning && path !== '/pomodoro') {
      alert('⏱️ O timer está ativo! Pare o Pomodoro antes de navegar.');
      return;
    }
    navigate(path);
  };

  const center = collapsed ? 'justify-center' : '';

  return (
    <aside
      className={`bg-white dark:bg-gray-900 min-h-screen shadow-lg flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`}
    >
      <div className={`p-4 border-b dark:border-gray-700 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-primary-600">🎓 FocusFlow</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Plataforma de Estudos</p>
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-2 mt-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = location.pathname === item.path;
            const blocked = isRunning && item.path !== '/pomodoro';
            return (
              <li key={item.path}>
                <button
                  onClick={() => go(item.path)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${center} ${
                    active
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                      : blocked
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-2 border-t dark:border-gray-700 space-y-1">
        <button
          onClick={toggle}
          title={collapsed ? (isDark ? 'Modo claro' : 'Modo escuro') : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${center}`}
        >
          <span className="flex-shrink-0">{isDark ? <Sun size={20} /> : <Moon size={20} />}</span>
          {!collapsed && <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>}
        </button>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Sair' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${center}`}
        >
          <span className="flex-shrink-0">
            <LogOut size={20} />
          </span>
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
