import { httpClient } from '@/shared/api/httpClient';
import type { Jogo } from '@/shared/interfaces/jogo';
import type { Paginated } from '@/shared/interfaces/pagination';

interface GetJogosParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export const jogosService = {

    getAll: (): Promise<Jogo[]> => {
        return httpClient.get<Jogo[]>(`/jogos`);
    },

    // Novo: busca paginada (envelope { data, pagination })
    getPaginated: (params: GetJogosParams = {}): Promise<Paginated<Jogo>> => {
        const query = new URLSearchParams();
        query.set('page', String(params.page ?? 1));
        query.set('limit', String(params.limit ?? 10));
        if (params.search) query.set('search', params.search);
        if (params.status) query.set('status', params.status);
        return httpClient.get<Paginated<Jogo>>(`/jogos?${query.toString()}`);
    },

    getByBolaoId: (bolaoId: string): Promise<Jogo[]> => {
        return httpClient.get<Jogo[]>(`/boloes/${bolaoId}/jogos`);
    },

    // Agora envia data_jogo (opcional p/ não quebrar chamadas antigas)
    add: (timeA: string, timeB: string, dataJogo?: string): Promise<Jogo> => {
        return httpClient.post<Jogo>(`/jogos`, {
            timeA,
            timeB,
            ...(dataJogo ? { data_jogo: dataJogo } : {}),
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