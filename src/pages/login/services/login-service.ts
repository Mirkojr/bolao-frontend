const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const authService = {
  login: async (email: string, senha: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }), 
    });

    if (!response.ok) {
      const erro = await response.json().catch(() => ({}));
      throw new Error(erro.message || 'Erro ao fazer login');
    }

    return response.json();
  },
};