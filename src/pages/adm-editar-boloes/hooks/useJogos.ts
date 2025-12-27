import { useState, useEffect, useCallback } from "react";
import type { Jogo } from "@/shared/interfaces/jogo";
import { JogosService } from "@/shared/services/jogos-service";

export const useJogos = (bolaoId: string | undefined) => {
    
    const [ todosJogos, setTodosJogos ] = useState<Jogo[]>([]);
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [loading, setLoading] = useState(false);

    // BUSCAR
    const carregarJogosByBolaoID = useCallback(async () => {
        if (!bolaoId) return;
        try {
            const j = await JogosService.getByBolaoId(bolaoId);
            setJogos(j);
        } catch (error) {
            console.error("Erro ao carregar jogos", error);
        }
    }, [bolaoId]);

    const carregarJogos = useCallback(async () => {
        setLoading(true);
        try {
            const j = await JogosService.getAll();
            setTodosJogos(j);
        } catch (error) {
            console.error("Erro ao carregar jogos", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // ADICIONAR
    const addJogo = async (timeA: string, timeB: string) => {
        if (!bolaoId) return;
        try {
            setLoading(true);
            await JogosService.add(bolaoId, timeA, timeB);
            await carregarJogosByBolaoID();
        } catch (error: any) {
            alert("Erro ao adicionar jogo: " + (error.message || ""));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarJogosByBolaoID();
    }, [carregarJogosByBolaoID]);

    return { 
        jogos, 
        addJogo, 
        loading,
        todosJogos,
        carregarJogos,
        refresh: carregarJogosByBolaoID 
    };
}