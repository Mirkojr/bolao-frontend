import { httpClient } from '@/shared/api/httpClient';
import type { Jogo } from '../interfaces/jogo';
 
export const JogosService = {
    getByBolaoId: async (bolaoId: string): Promise<Jogo[]> => {
        return httpClient.get<Jogo[]>(`/boloes/${bolaoId}/jogos`);
    },

    getJogos: async (bolaoId: string): Promise<Jogo[]> => {
        return httpClient.get<Jogo[]>(`/boloes/${bolaoId}/jogos`);
    },

    add: async (bolaoId: string, timeA: string, timeB: string): Promise<Jogo> => {
        return httpClient.post<Jogo>(`/boloes/${bolaoId}/jogos`, { 
            timeA: timeA, 
            timeB: timeB 
        });
    }
};