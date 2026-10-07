import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import Layout from './components/layout/Layout';
import PomodoroGuard from './components/layout/PomodoroGuard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import PomodoroPage from './pages/PomodoroPage';
import FlashcardsPage from './pages/FlashcardsPage';
import FlashcardReviewPage from './pages/FlashcardReviewPage';
import GoalsPage from './pages/GoalsPage';
import MindMapsPage from './pages/MindMapsPage';

export default function App() {
  const { loadUserFromStorage, isAuthenticated } = useAuthStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const protectedRoute = (page: ReactElement) =>
    isAuthenticated ? <Layout>{page}</Layout> : <Navigate to="/login" />;

  return (
    <BrowserRouter>
      <PomodoroGuard />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route path="/dashboard" element={protectedRoute(<DashboardPage />)} />
        <Route path="/subjects" element={protectedRoute(<SubjectsPage />)} />
        <Route path="/subjects/:id" element={protectedRoute(<SubjectDetailPage />)} />
        <Route path="/pomodoro" element={protectedRoute(<PomodoroPage />)} />
        <Route path="/flashcards" element={protectedRoute(<FlashcardsPage />)} />
        <Route path="/flashcards/review" element={protectedRoute(<FlashcardReviewPage />)} />
        <Route path="/goals" element={protectedRoute(<GoalsPage />)} />
        <Route path="/mindmaps" element={protectedRoute(<MindMapsPage />)} />

        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
