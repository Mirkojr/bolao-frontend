import { httpClient } from '@/shared/api/httpClient';
import type { Bolao } from '@/shared/interfaces/bolao';
import type { Paginated } from '@/shared/interfaces/pagination';

interface GetBoloesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const boloesService = {
    getAll: (): Promise<Bolao[]> => {
        return httpClient.get<Bolao[]>('/boloes');
    },

    getPaginated: (params: GetBoloesParams = {}): Promise<Paginated<Bolao>> => {
        const query = new URLSearchParams();
        query.set('page', String(params.page ?? 1));
        query.set('limit', String(params.limit ?? 10));
        if (params.search) query.set('search', params.search);
        return httpClient.get<Paginated<Bolao>>(`/boloes?${query.toString()}`);
    },

    create: (dadosBolao: Partial<Bolao>): Promise<Bolao> => {
        return httpClient.post<Bolao>('/boloes', dadosBolao);
    },

    getById: (id: number): Promise<Bolao> => {
        return httpClient.get<Bolao>(`/boloes/${id}`);
    },

    delete: (id: number): Promise<void> => {
        return httpClient.delete<void>(`/boloes/${id}`);
    }
};