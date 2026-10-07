import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getErrorMessage } from '../utils/error';
import { Alert, Button, Input } from '../components/ui';

export default function RegisterPage() {
  const { register } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirm) {
      setError('As senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const result = await register(name, email, password);
      setSuccess(result.message);
      setName('');
      setEmail('');
      setPassword('');
      setConfirm('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">🎓 FocusFlow</h1>
          <p className="text-gray-600">Crie sua conta gratuita</p>
        </div>

        {success && (
          <div className="mb-6">
            <Alert type="success">
              <p className="font-medium">Cadastro realizado! 🎉</p>
              <p className="text-sm mt-1">{success}</p>
            </Alert>
          </div>
        )}
        {error && (
          <div className="mb-6">
            <Alert type="error">{error}</Alert>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Nome completo" type="text" placeholder="João Silva" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
            <Input label="Email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              helperText="Mínimo de 6 caracteres"
            />
            <Input label="Confirmar senha" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required disabled={loading} />
            <Button type="submit" fullWidth isLoading={loading} disabled={loading}>
              Criar conta
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
