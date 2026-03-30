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
    }, []);

    // -- EFEITOS --
    useEffect(() => {
        window.addEventListener(AUTH_LOGOUT_EVENT, logout);
        return () => window.removeEventListener(AUTH_LOGOUT_EVENT, logout);
    }, [logout]); 

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