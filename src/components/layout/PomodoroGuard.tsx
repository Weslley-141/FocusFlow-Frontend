import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { usePomodoroStore } from '../../stores/pomodoroStore';

/**
 * Trava o app enquanto o Pomodoro está ativo (foco ou pausa):
 *  1. qualquer rota diferente de /pomodoro é redirecionada de volta;
 *  2. a seta "voltar" do navegador fica presa na própria página;
 *  3. refresh/fechar a aba pede confirmação.
 * O bloqueio some quando o timer termina ou o usuário clica em parar.
 */
export default function PomodoroGuard() {
  const isRunning = usePomodoroStore((s) => s.isRunning);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();
  const locked = isRunning && isAuthenticated;

  // 1. Rede de segurança: qualquer navegação para fora volta para o Pomodoro.
  useEffect(() => {
    if (locked && location.pathname !== '/pomodoro') {
      navigate('/pomodoro', { replace: true });
    }
  }, [locked, location.pathname, navigate]);

  // 2 e 3. Armadilha no histórico + aviso ao recarregar/fechar.
  useEffect(() => {
    if (!locked) return;

    // Entrada "sentinela": ao apertar voltar, o navegador cai na entrada anterior (mesma URL)
    // e o handler abaixo avança de novo para a sentinela, então o usuário nunca sai da página.
    window.history.pushState(window.history.state, '', window.location.href);

    const onPopState = () => window.history.go(1);
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [locked]);

  return null;
}
