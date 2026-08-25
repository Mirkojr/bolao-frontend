import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '@/shared/api/httpClient';
import { authService } from './services/login-service';

export const Register = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (senha !== confirmacao) {
      setErro('As senhas não conferem.');
      return;
    }

    setLoading(true);

    try {
      await authService.register(nome, email, senha);
      setSucesso(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setErro(error instanceof ApiError || error instanceof Error
        ? error.message
        : 'Ocorreu um erro inesperado ao criar sua conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">Criar conta</h2>
        <p className="mb-6 text-center text-sm text-gray-600">Entre para participar dos bolões.</p>

        {sucesso ? (
          <div className="rounded bg-green-50 p-4 text-center text-sm text-green-700">
            Conta criada com sucesso. Redirecionando para o login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                id="nome"
                type="text"
                required
                minLength={2}
                autoComplete="name"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                id="senha"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">Use pelo menos 6 caracteres.</p>
            </div>

            <div>
              <label htmlFor="confirmacao" className="block text-sm font-medium text-gray-700">Confirmar senha</label>
              <input
                id="confirmacao"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
              />
            </div>

            {erro && (
              <div className="rounded bg-red-50 p-2 text-center text-sm text-red-600">{erro}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${loading ? 'cursor-not-allowed bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-green-700 hover:text-green-800">Entrar</Link>
        </p>
      </div>
    </div>
  );
};
