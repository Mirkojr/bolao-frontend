import type { User } from "@/shared/interfaces/user";
import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('u_data');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData: User) => {
        const userToSave = {
            id: String(userData.id),
            nome: userData.nome,
            pontuacao_total: userData.pontuacao_total,
            role: userData.role,
        };
        setUser(userToSave);
        localStorage.setItem('u_data', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('meu_token');
        localStorage.removeItem('u_data'); 
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};