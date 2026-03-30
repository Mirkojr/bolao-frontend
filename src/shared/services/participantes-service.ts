import { httpClient } from '@/shared/api/httpClient';
import type { Participante } from '@/shared/interfaces/participante';

export const participantesService = {
    getByBolaoId: (bolaoId: string): Promise<Participante[]> => {
        return httpClient.get<Participante[]>(`/boloes/${bolaoId}/participantes`);
    },

    add: (bolaoId: string, nome: string): Promise<Participante> => {
        return httpClient.post<Participante>(`/boloes/${bolaoId}/participantes`, { nome });
    },

    remove: (bolaoId: string, id: number): Promise<Participante> => {
        return httpClient.delete<Participante>(`/boloes/${bolaoId}/participantes/${id}`);
    }
};