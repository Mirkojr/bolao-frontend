import { useState, useEffect, useCallback } from "react";
import type { Palpite } from "@/shared/interfaces/palpite";
import { palpitesService } from "@/shared/services/palpite-service";

export const usePalpites = (bolaoId: string | undefined) => {
    
    const [palpites, setPalpites] = useState<Palpite[]>([]);
    const [loading, setLoading] = useState(false);

    // BUSCAR
    const carregarPalpites = useCallback(async () => {
        if (!bolaoId) return;
        try {
            const p = await palpitesService.getByBolaoId(bolaoId);
            setPalpites(p);
        } catch (error) {
            console.error("Erro ao carregar palpites", error);
        }
    }, [bolaoId]);

    // SALVAR
    const savePalpite = async (participanteId: string, jogoId: string, pa: number, pb: number) => {
        if (!bolaoId) return;
        try {
            setLoading(true);
            await palpitesService.save(bolaoId, {
                participante_id: participanteId,
                jogo_id: jogoId,
                gol_a_palpite: pa,
                gol_b_palpite: pb
            });
            await carregarPalpites(); 
        } catch (error: any) {
            alert(error.message || "Erro ao salvar palpite");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarPalpites();
    }, [carregarPalpites]);

    return { 
        palpites, 
        savePalpite, 
        loading,
        refresh: carregarPalpites 
    };
}