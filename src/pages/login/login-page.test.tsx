import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, AVISO_SESSAO_EXPIRADA } from '@/context/AuthContext';
import { Login } from './login-page';

const renderizar = () => render(<MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>);

describe('Login', () => {
    it('avisa uma vez que a sessão expirou', () => {
        sessionStorage.setItem(AVISO_SESSAO_EXPIRADA, '1');
        const { unmount } = renderizar();
        expect(screen.getByRole('status')).toHaveTextContent('Sua sessão expirou');
        expect(sessionStorage.getItem(AVISO_SESSAO_EXPIRADA)).toBeNull();
        unmount();

        renderizar();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});
