import { httpClient } from '@/shared/api/httpClient';
import type { Jogo } from '@/shared/interfaces/jogo';
 
export const jogosService = {

    getAll: (): Promise<Jogo[]> => {
        return httpClient.get<Jogo[]>(`/jogos`);
    },

    getByBolaoId: (bolaoId: string): Promise<Jogo[]> => {
        return httpClient.get<Jogo[]>(`/boloes/${bolaoId}/jogos`);
    },

    add: (timeA: string, timeB: string): Promise<Jogo> => {
        // O backend deve buscar o ID dos times pelo nome ou criar se não existir
        return httpClient.post<Jogo>(`/jogos`, { 
            timeA: timeA, 
            timeB: timeB 
        });
    },
    
    addJogoToBolao: (bolaoId: string, jogoId: string): Promise<void> => {
        return httpClient.post<void>(`/boloes/${bolaoId}/jogos/${jogoId}`, {});
    },

    delete: (bolaoId: string, jogoId: string): Promise<void> => {
        return httpClient.delete<void>(`/boloes/${bolaoId}/jogos/${jogoId}`);
    },

    update: (jogoId: string, dadosJogo: Partial<Jogo>): Promise<Jogo> => {
        return httpClient.put<Jogo>(`/jogos/${jogoId}`, dadosJogo);
    },
};