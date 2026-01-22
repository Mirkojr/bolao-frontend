import { httpClient } from '@/shared/api/httpClient';
import type { Jogo } from '@/shared/interfaces/jogo';
 
export const JogosService = {

    getAll: async (): Promise<Jogo[]> => {
        return httpClient.get<Jogo[]>(`/jogos`);
    },

    getByBolaoId: async (bolaoId: string): Promise<Jogo[]> => {
        return httpClient.get<Jogo[]>(`/boloes/${bolaoId}/jogos`);
    },

    add: async (timeA: string, timeB: string): Promise<Jogo> => {
        // O backend deve buscar o ID dos times pelo nome ou criar se não existir
        return httpClient.post<Jogo>(`/jogos`, { 
            timeA: timeA, 
            timeB: timeB 
        });
    },
    
    delete: async (bolaoId: string, jogoId: string): Promise<void> => {
        return httpClient.delete<void>(`/boloes/${bolaoId}/jogos/${jogoId}`);
    }
};