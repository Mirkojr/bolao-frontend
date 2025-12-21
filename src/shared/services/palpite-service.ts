import { httpClient } from '../api/httpClient';
import type { Palpite } from '../interfaces/palpite';

export const PalpitesService = {
    getByBolaoId: async (bolaoId: string): Promise<Palpite[]> => {
        return httpClient.get<Palpite[]>(`/boloes/${bolaoId}/palpites`);
    },

    save: async (bolaoId: string, payload: { participante_id: string, jogo_id: string; gol_a_palpite: number; gol_b_palpite: number }) => {
        return httpClient.post<Palpite>(`/boloes/${bolaoId}/palpites`, payload);
    },

    getPalpites: async (bolaoId: string): Promise<Palpite[]> => {
        return httpClient.get<Palpite[]>(`/boloes/${bolaoId}/palpites`);
    }

};