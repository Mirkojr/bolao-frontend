import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { AuthProvider, AVISO_SESSAO_EXPIRADA, lerExpiracaoDoToken, useAuth } from './AuthContext';
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

// JWT de teste (só o payload importa: a assinatura não é verificada no navegador)
const jwtComExp = (expSegundos: number) =>
    `cabecalho.${btoa(JSON.stringify({ id: 7, exp: expSegundos })).replace(/=+$/, '')}.assinatura`;

describe('expiração da sessão', () => {
    afterEach(() => {
        vi.useRealTimers();
        sessionStorage.clear();
    });

    it('lê o exp do token', () => {
        expect(lerExpiracaoDoToken(jwtComExp(1_900_000_000))).toBe(1_900_000_000_000);
        expect(lerExpiracaoDoToken('lixo')).toBeNull();
    });

    it('desloga sozinho quando o token expira e deixa o aviso para a tela de login', () => {
        vi.useFakeTimers();
        const agora = Date.now();
        localStorage.setItem('meu_token', jwtComExp(Math.floor(agora / 1000) + 60)); // expira em 1 min
        localStorage.setItem('u_data', JSON.stringify({ ...usuario, id: '7' }));
        montar();
        expect(screen.getByText('logado:Ana')).toBeInTheDocument();

        act(() => { vi.advanceTimersByTime(59_000); });
        expect(screen.getByText('logado:Ana')).toBeInTheDocument();

        act(() => { vi.advanceTimersByTime(2_000); });
        expect(screen.getByText('deslogado')).toBeInTheDocument();
        expect(localStorage.getItem('meu_token')).toBeNull();
        expect(sessionStorage.getItem(AVISO_SESSAO_EXPIRADA)).toBe('1');
    });

    it('token já vencido ao abrir o app desloga em seguida', () => {
        vi.useFakeTimers();
        localStorage.setItem('meu_token', jwtComExp(Math.floor(Date.now() / 1000) - 10));
        localStorage.setItem('u_data', JSON.stringify({ ...usuario, id: '7' }));
        montar();

        act(() => { vi.advanceTimersByTime(0); });
        expect(screen.getByText('deslogado')).toBeInTheDocument();
    });
});

