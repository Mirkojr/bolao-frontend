import { httpClient } from '@/shared/api/httpClient';
import type { Palpite } from '@/shared/interfaces/palpite';

export const palpitesService = {
    getByBolaoId: (bolaoId: string): Promise<Palpite[]> => {
        return httpClient.get<Palpite[]>(`/boloes/${bolaoId}/palpites`);
    },

    save: async (bolaoId: string, payload: { 
        participante_id: string; 
        jogo_id: string; 
        gol_a_palpite: number; 
        gol_b_palpite: number 
    }) => {
        return httpClient.post<Palpite>(`/boloes/${bolaoId}/palpites`, payload);
    }
};