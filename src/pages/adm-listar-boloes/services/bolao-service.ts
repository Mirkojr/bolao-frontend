import type { Bolao } from '../../../shared/interfaces/bolao';
import type { Jogo } from '../../../shared/interfaces/jogo';
import type { Participante } from '../../../shared/interfaces/participante';
import type { Palpite } from '../../../shared/interfaces/palpite';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('meu_token')}`,
    });

export const BolaoService = {
    
  // Função para buscar todos os bolões
  getAll: async (): Promise<Bolao[]> => {
    try {
        const response = await fetch(`${API_URL}/boloes`, {
            method: 'GET',
            headers: getHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }

        const data = await response.json();
        return data;
        } catch (error) {
        console.error('Erro no serviço de bolões:', error);
        return [];
        }
    },

    create: async (bolao: Partial<Bolao>): Promise<Bolao> => {
        try {
            const response = await fetch(`${API_URL}/boloes`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(bolao),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar bolão');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao criar bolão:', error);
            throw error;
        }
    },

    getJogos: async (bolaoId: string): Promise<Jogo[]> => {
        const res = await fetch(`${API_URL}/boloes/${bolaoId}/jogos`, { headers: getHeaders() });
        return res.ok ? res.json() : [];
    },

    getParticipantes: async (bolaoId: string): Promise<Participante[]> => {
        const res = await fetch(`${API_URL}/boloes/${bolaoId}/participantes`, { headers: getHeaders() });
        return res.ok ? res.json() : [];
    },

    getPalpites: async (bolaoId: string): Promise<Palpite[]> => {
        const res = await fetch(`${API_URL}/boloes/${bolaoId}/palpites`, { headers: getHeaders() });
        return res.ok ? res.json() : [];
    },
    
    savePalpite: async (bolaoId: string, participanteId: string, jogoId: string, placarA: number, placarB: number) => {
        const response = await fetch(`${API_URL}/boloes/${bolaoId}/palpites`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                // LADO ESQUERDO: Nome que o Backend espera
                // LADO DIREITO: Variável que você tem aqui no Frontend
                participante_id: participanteId,
                jogo_id: jogoId,
                gol_a_palpite: placarA,
                gol_b_palpite: placarB
            }),
        });

        if (!response.ok) throw new Error('Erro ao salvar palpite');
        return response.json();
    },

    addParticipante: async (bolaoId: string, nome: string) => {
        const response = await fetch(`${API_URL}/boloes/${bolaoId}/participantes`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ nome }),
        });
        if (!response.ok) throw new Error('Erro ao adicionar participante');
        return response.json();
    },

    addJogo: async (bolaoId: string, timeA: string, timeB: string) => {
        const response = await fetch(`${API_URL}/boloes/${bolaoId}/jogos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ timeA, timeB }),
        });
        if (!response.ok) throw new Error('Erro ao adicionar jogo');
        return response.json();
    },
};