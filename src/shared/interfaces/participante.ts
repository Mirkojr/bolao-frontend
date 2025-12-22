export interface Participante {
    id: number;
    user_id: number | null;
    bolao_id: number;
    nome: string;
    pontuacao_no_bolao?: number;
    nome_avulso?: string | null;
}