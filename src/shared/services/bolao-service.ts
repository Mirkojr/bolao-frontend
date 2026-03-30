import { httpClient } from '@/shared/api/httpClient';
import type { Bolao } from '@/shared/interfaces/bolao';

export const boloesService = {
    getAll: (): Promise<Bolao[]> => {
        return httpClient.get<Bolao[]>('/boloes');
    },

    create: (dadosBolao: Partial<Bolao>): Promise<Bolao> => {
        return httpClient.post<Bolao>('/boloes', dadosBolao);
    },

    getById: (id: number): Promise<Bolao> => {
        return httpClient.get<Bolao>(`/boloes/${id}`);
    }
};