import { httpClient } from "../api/httpClient";
import { type Time } from "../interfaces/time";
import type { Paginated } from "../interfaces/pagination";

interface GetTimesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const timeService = {
    getAll: (): Promise<Time[]> => {
        return httpClient.get<Time[]>('/times');
    },

    getPaginated: (params: GetTimesParams = {}): Promise<Paginated<Time>> => {
        const query = new URLSearchParams();
        query.set('page', String(params.page ?? 1));
        query.set('limit', String(params.limit ?? 10));
        if (params.search) query.set('search', params.search);
        return httpClient.get<Paginated<Time>>(`/times?${query.toString()}`);
    },

    add: (dadosTime: Partial<Time>): Promise<Time> => {
        return httpClient.post<Time>('/times', dadosTime);
    },

    delete: (timeId: string): Promise<void> => {
        return httpClient.delete(`/times/${timeId}`);
    },

    update: (timeId: string, dadosTime: Partial<Time>): Promise<Time> => {
        return httpClient.put<Time>(`/times/${timeId}`, dadosTime);
    },
}