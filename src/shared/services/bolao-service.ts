import { httpClient } from '@/shared/api/httpClient';
import type { Bolao } from '@/shared/interfaces/bolao';

export const BoloesService = {
    getAll: async (): Promise<Bolao[]> => {
        return httpClient.get<Bolao[]>('/boloes');
    },

    create: async (dadosBolao: Partial<Bolao>): Promise<Bolao> => {
        return httpClient.post<Bolao>('/boloes', dadosBolao);
    },

    getById: async (id: number): Promise<Bolao> => {
        return httpClient.get<Bolao>(`/boloes/${id}`);
    }
};