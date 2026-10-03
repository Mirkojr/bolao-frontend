import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AdminRoute } from './AdminRoute';
import { AuthenticatedRoute } from './AuthenticatedRoute';

function renderizar(rota: string, role?: 'USER' | 'ADMIN') {
    if (role) localStorage.setItem('u_data', JSON.stringify({ id: '1', nome: 'X', role }));
    return render(
        <MemoryRouter initialEntries={[rota]}>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<p>tela de login</p>} />
                    <Route element={<AuthenticatedRoute />}>
                        <Route path="/boloes" element={<p>meus bolões</p>} />
                    </Route>
                    <Route element={<AdminRoute />}>
                        <Route path="/admin/jogos" element={<p>admin jogos</p>} />
                    </Route>
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
}

describe('AuthenticatedRoute', () => {
    it('manda para o login quem não está logado', () => {
        renderizar('/boloes');
        expect(screen.getByText('tela de login')).toBeInTheDocument();
    });

    it('mostra a página para quem está logado', () => {
        renderizar('/boloes', 'USER');
        expect(screen.getByText('meus bolões')).toBeInTheDocument();
    });
});

describe('AdminRoute', () => {
    it('finge que a página não existe para quem não é admin', () => {
        renderizar('/admin/jogos', 'USER');
        expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
        expect(screen.queryByText('admin jogos')).not.toBeInTheDocument();
    });

    it('mostra a página para o admin', () => {
        renderizar('/admin/jogos', 'ADMIN');
        expect(screen.getByText('admin jogos')).toBeInTheDocument();
    });
});
