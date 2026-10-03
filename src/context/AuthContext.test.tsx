import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { AUTH_LOGOUT_EVENT } from '@/shared/api/httpClient';
import type { User } from '@/shared/interfaces/user';

const usuario = { id: 7, nome: 'Ana', role: 'USER', pontuacao_total: 0 } as unknown as User;

function Espiao() {
    const { user, login, logout } = useAuth();
    return (
        <>
            <span>{user ? `logado:${user.nome}` : 'deslogado'}</span>
            <button onClick={() => login(usuario)}>entrar</button>
            <button onClick={logout}>sair</button>
        </>
    );
}

const montar = () => render(<AuthProvider><Espiao /></AuthProvider>);

describe('AuthContext', () => {
    it('login guarda o usuário (com id em string) e logout limpa tudo', () => {
        montar();
        expect(screen.getByText('deslogado')).toBeInTheDocument();

        fireEvent.click(screen.getByText('entrar'));
        expect(screen.getByText('logado:Ana')).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('u_data')!)).toMatchObject({ id: '7', nome: 'Ana' });

        localStorage.setItem('meu_token', 'abc');
        fireEvent.click(screen.getByText('sair'));
        expect(screen.getByText('deslogado')).toBeInTheDocument();
        expect(localStorage.getItem('u_data')).toBeNull();
        expect(localStorage.getItem('meu_token')).toBeNull();
    });

    it('restaura o usuário salvo e ignora dados corrompidos', () => {
        localStorage.setItem('u_data', JSON.stringify({ ...usuario, id: '7' }));
        const { unmount } = montar();
        expect(screen.getByText('logado:Ana')).toBeInTheDocument();
        unmount();

        localStorage.setItem('u_data', '{corrompido');
        montar();
        expect(screen.getByText('deslogado')).toBeInTheDocument();
    });

    it('desloga quando o httpClient avisa que a sessão expirou', () => {
        localStorage.setItem('u_data', JSON.stringify({ ...usuario, id: '7' }));
        montar();

        act(() => { window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT)); });
        expect(screen.getByText('deslogado')).toBeInTheDocument();
    });

    it('useAuth fora do provider dá erro claro', () => {
        expect(() => render(<Espiao />)).toThrow('useAuth deve ser usado obrigatoriamente dentro de um AuthProvider');
    });
});
