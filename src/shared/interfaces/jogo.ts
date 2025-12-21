
export interface Time {
    id: string;
    nome: string;
    sigla: string;
    escudo_url?: string;
}

export interface Jogo {
    id: string;
    time_a_id: number;
    time_b_id: number;
    data_jogo: string;
    status: string;
    
    timeA: Time;
    timeB: Time;
    
    gol_a_real?: number;
    gol_b_real?: number;
}

