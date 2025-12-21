import { httpClient } from '@/shared/api/httpClient';
import type { Participante } from '@/shared/interfaces/participante';

export const ParticipantesService = {
    getByBolaoId: async (bolaoId: string): Promise<Participante[]> => {
        return httpClient.get<Participante[]>(`/boloes/${bolaoId}/participantes`);
    },

    add: async (bolaoId: string, nome: string): Promise<Participante> => {
        return httpClient.post<Participante>(`/boloes/${bolaoId}/participantes`, { nome });
    },

    getParticipantes: async (bolaoId: string): Promise<Participante[]> => {
        return httpClient.get<Participante[]>(`/boloes/${bolaoId}/participantes`);
    }
};