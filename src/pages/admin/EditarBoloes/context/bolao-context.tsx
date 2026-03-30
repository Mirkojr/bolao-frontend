import { useContext, createContext } from "react";
import type { Palpite } from "@/shared/interfaces/palpite";

interface BolaoContextData{
    palpites : Palpite[],
    onSavePalpite: (partId: string, jogoId: string, pa: number, pb: number) => Promise<void>,
    getPalpite: (partId: number, jogoId: number) => Palpite | undefined;
}

const BolaoContext = createContext({} as BolaoContextData);

export const useBolaoContext = useContext(BolaoContext);

export const BolaoProvider = ({ children, palpites, onSavePalpite }: any) => {

    const palpiteMap = new Map<string, Palpite>();
    palpites.forEach((p: Palpite) => palpiteMap.set(`${p.participante_id}-${p.jogo_id}`, p));

    const getPalpite = (partId: number, jogoId: number) => {
        return palpiteMap.get(`${partId}-${jogoId}`);
    };
    
    return (
        <BolaoContext.Provider value={{ palpites, onSavePalpite, getPalpite }}>
        {children}
        </BolaoContext.Provider>
    );
};