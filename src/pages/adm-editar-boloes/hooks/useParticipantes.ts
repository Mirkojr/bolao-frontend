import { useState, useEffect, useCallback } from "react";
import { ParticipantesService } from "@/shared/services/participantes-service";
import type { Participante } from "@/shared/interfaces/participante";

export const useParticipantes = (bolaoId: string | undefined) => {
    
    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [loading, setLoading] = useState(false); 

    // BUSCAR (GET)
    const carregarParticipantes = useCallback(async () => {
        if (!bolaoId) return;
        try {
            setLoading(true); 
            const dados = await ParticipantesService.getByBolaoId(bolaoId);
            setParticipantes(dados);
        } catch (error) {
            console.error("Erro ao carregar participantes", error);
        } finally {
            setLoading(false);
        }
    }, [bolaoId]);

    // ADICIONAR
    const addParticipante = async (nome: string) => {
        if (!bolaoId) return;
        try {
            setLoading(true);
            await ParticipantesService.add(bolaoId, nome);
            await carregarParticipantes();
        } catch (error: any) {
            alert("Erro ao adicionar: " + (error.message || ""));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarParticipantes();
    }, [carregarParticipantes]);

    return { 
        participantes, 
        addParticipante, 
        loading,
        refresh: carregarParticipantes 
    };
}