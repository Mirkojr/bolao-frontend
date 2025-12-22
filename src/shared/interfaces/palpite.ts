export interface Palpite {
    id?: number; 
    bolao_id: number;
    participante_id: number;
    jogo_id: number;
    gol_a_palpite: number; 
    gol_b_palpite: number;
    pontos_ganhos?: number;
}