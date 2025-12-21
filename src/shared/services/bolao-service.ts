import { httpClient } from '../api/httpClient';
import type { Bolao } from '../interfaces/bolao';

export const BoloesService = {
    getAll: async (): Promise<Bolao[]> => {
        return httpClient.get<Bolao[]>('/boloes');
    },

    create: async (dadosBolao: Partial<Bolao>): Promise<Bolao> => {
        return httpClient.post<Bolao>('/boloes', dadosBolao);
    },

    getById: async (id: string): Promise<Bolao> => {
        return httpClient.get<Bolao>(`/boloes/${id}`);
    }
};