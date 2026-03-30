// src/pages/login/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './services/login-service';
import { useAuth } from '@/context/AuthContext';


const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const resposta = await authService.login(email, senha);
    
      if (resposta.token) {
        
        alert('Login com sucesso!');
        localStorage.setItem('meu_token', resposta.token); 
        
        login(resposta.user); 
        
        navigate('/admin/bolao-crud');
    
      } else {
        console.warn('Login funcionou, mas sem token.');
      }

      } catch (error: any) {
        console.error(error);
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Acessar Conta</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="********"
            />
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;