import type { Time } from './time';

export interface Jogo {
    id: number;
    time_a_id: number;
    time_b_id: number;
    data_jogo: string;
    status: 'AGENDADO' | 'EM_ANDAMENTO' | 'FINALIZADO'; 
    timeA?: Time;
    timeB?: Time;
    gol_a_real?: number | null;
    gol_b_real?: number | null;
}