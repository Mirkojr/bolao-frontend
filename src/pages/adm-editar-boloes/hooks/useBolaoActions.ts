import { useCallback } from "react";
import { ParticipantesService } from "../../../shared/services/participantes-service";
import { JogosService } from "../../../shared/services/jogos-service";
import { PalpitesService } from "../../../shared/services/palpite-service";

// Hook para gerenciar ações de escrita em um bolão específico 
// (adicionar participante, jogo, e salvar palpite)
export const useBolaoActions = (bolaoId: string | undefined, onSuccess: () => void) => {
    
    const addParticipante = useCallback(async (nome: string) => {
        if (!bolaoId) return;
        try {
            await ParticipantesService.add(bolaoId, nome);
            onSuccess(); // Chama o refresh 
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar participante");
        }
    }, [bolaoId, onSuccess]);

    const addJogo = useCallback(async (timeA: string, timeB: string) => {
        if (!bolaoId) return;
        try {
            await JogosService.add(bolaoId, timeA, timeB);
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar jogo");
        }
    }, [bolaoId, onSuccess]);

    const savePalpite = useCallback(async (partId: string, jogoId: string, pa: number, pb: number) => {
        if (!bolaoId) return;
        try {
            await PalpitesService.save(bolaoId, {
                participante_id: partId,
                jogo_id: jogoId,
                gol_a_palpite: pa,
                gol_b_palpite: pb
            });
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar palpite");
        }
    }, [bolaoId, onSuccess]);

    return { addParticipante, addJogo, savePalpite };
};