import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";
import type { User } from "@/shared/interfaces/user";
import { AUTH_LOGOUT_EVENT } from "@/shared/api/httpClient";

// ==========================================
// 1. CONSTANTES E TIPAGENS
// ==========================================
const STORAGE_KEYS = {
    USER: 'u_data',
    TOKEN: 'meu_token',
} as const;

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Marca (no sessionStorage) que a sessão expirou, para a tela de login avisar */
export const AVISO_SESSAO_EXPIRADA = 'sessao_expirada';

/** Momento (ms) em que o JWT expira, lido do campo `exp`; null se não der para ler */
export const lerExpiracaoDoToken = (token: string): number | null => {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const { exp } = JSON.parse(atob(payload));
        return typeof exp === 'number' ? exp * 1000 : null;
    } catch {
        return null;
    }
};

// setTimeout só aceita até ~24,8 dias
const MAX_TIMEOUT = 2 ** 31 - 1;

// FUNÇÕES HELPERS 
const getStoredUser = (): User | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null; 
    }
};

const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    // -- ESTADO --
    const [user, setUser] = useState<User | null>(getStoredUser);

    // -- AÇÕES --
    const login = useCallback((userData: User) => {
        const userToSave = { ...userData, id: String(userData.id) };
        
        setUser(userToSave);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToSave));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        clearAuthData();

        if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/login'; 
        }
    }, []);

    const expirarSessao = useCallback(() => {
        sessionStorage.setItem(AVISO_SESSAO_EXPIRADA, '1');
        logout();
    }, [logout]);

    // -- EFEITOS --
    // A API respondeu 401 com sessão ativa (token expirado ou inválido)
    useEffect(() => {
        window.addEventListener(AUTH_LOGOUT_EVENT, expirarSessao);
        return () => window.removeEventListener(AUTH_LOGOUT_EVENT, expirarSessao);
    }, [expirarSessao]); 

    // Desloga no momento em que o token expira, sem esperar a próxima
    // requisição falhar (inclusive quando o app abre com um token já vencido)
    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const expiraEm = token ? lerExpiracaoDoToken(token) : null;
        if (expiraEm === null) return;

        const restante = Math.max(0, expiraEm - Date.now());
        const timer = setTimeout(expirarSessao, Math.min(restante, MAX_TIMEOUT));
        return () => clearTimeout(timer);
    }, [user, expirarSessao]);

    // -- RETORNO --
    const contextValue = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        login,
        logout
    }), [user, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth deve ser usado obrigatoriamente dentro de um AuthProvider");
    }
    return context;
};