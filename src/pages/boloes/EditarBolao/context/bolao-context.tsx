import { createContext, useContext, useMemo, useCallback, type ReactNode } from "react";
import type { Palpite } from "@/shared/interfaces/palpite";

interface BolaoContextData {
    palpites: Palpite[];
    onSavePalpite: (partId: string, jogoId: string, pa: number, pb: number) => Promise<void>;
    // Permiti string e number aqui pra evitar dor de cabeça com IDs vindo da URL
    getPalpite: (partId: number | string, jogoId: number | string) => Palpite | undefined;
}

interface BolaoProviderProps {
    children: ReactNode;
    palpites: Palpite[];
    onSavePalpite: (partId: string, jogoId: string, pa: number, pb: number) => Promise<void>;
}

const BolaoContext = createContext<BolaoContextData | undefined>(undefined);

export const BolaoProvider = ({ children, palpites, onSavePalpite }: BolaoProviderProps) => {

    const palpiteMap = useMemo(() => {
        const map = new Map<string, Palpite>();
        palpites.forEach((p) => map.set(`${p.participante_id}-${p.jogo_id}`, p));
        return map;
    }, [palpites]);

    const getPalpite = useCallback((partId: number | string, jogoId: number | string) => {
        return palpiteMap.get(`${partId}-${jogoId}`);
    }, [palpiteMap]);

    const contextValue = useMemo(() => ({
        palpites,
        onSavePalpite,
        getPalpite
    }), [palpites, onSavePalpite, getPalpite]);
    
    return (
        <BolaoContext.Provider value={contextValue}>
            {children}
        </BolaoContext.Provider>
    );
};

export const useBolaoContext = () => {
    const context = useContext(BolaoContext);
    if (context === undefined) {
        throw new Error("useBolaoContext deve ser usado obrigatoriamente dentro de um BolaoProvider");
    }
    return context;
};