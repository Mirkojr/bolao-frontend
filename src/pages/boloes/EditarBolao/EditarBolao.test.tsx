import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { EditarBolaoPage } from './EditarBolao';

// Simula a API: /boloes/1 responde com o status pedido; o resto, lista vazia
function stubApi(statusBolao: number) {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
        const caminho = new URL(url, 'http://api').pathname;
        if (caminho === '/boloes/1') {
            const corpo = statusBolao === 200
                ? { id: 1, nome: 'Bolão da Firma' }
                : { message: statusBolao === 403 ? 'Você não tem acesso a este bolão.' : 'Bolão não encontrado.' };
            return new Response(JSON.stringify(corpo), { status: statusBolao });
        }
        return new Response('[]', { status: 200 });
    }));
}

const renderizar = () => render(
    <MemoryRouter initialEntries={['/boloes/1']}>
        <AuthProvider>
            <Routes>
                <Route path="/boloes/:id" element={<EditarBolaoPage />} />
            </Routes>
        </AuthProvider>
    </MemoryRouter>
);

describe('EditarBolaoPage', () => {
    beforeEach(() => {
        localStorage.setItem('u_data', JSON.stringify({ id: '2', nome: 'Ana', role: 'USER' }));
        localStorage.setItem('meu_token', 'x');
    });
    afterEach(() => vi.unstubAllGlobals());

    it('mostra o nome real do bolão', async () => {
        stubApi(200);
        renderizar();
        expect(await screen.findByText('Bolão da Firma')).toBeInTheDocument();
    });

    it('sem acesso (403), explica em vez de mostrar a página vazia', async () => {
        stubApi(403);
        renderizar();
        expect(await screen.findByText('Você não tem acesso a este bolão.')).toBeInTheDocument();
        expect(screen.getByText('Voltar para meus bolões')).toBeInTheDocument();
        expect(screen.queryByText('Tentar novamente')).not.toBeInTheDocument();
        expect(screen.queryByText('Adicionar Jogos')).not.toBeInTheDocument();
    });

    it('bolão inexistente (404) também', async () => {
        stubApi(404);
        renderizar();
        expect(await screen.findByText('Bolão não encontrado.')).toBeInTheDocument();
    });
});
