import { useState, useEffect, useCallback } from "react";
import type { Jogo } from "@/shared/interfaces/jogo";
import { JogosService } from "@/shared/services/jogos-service";


export const useJogos = (bolaoId: string | null = null) => {
    
    const [ todosJogos, setTodosJogos ] = useState<Jogo[]>([]);
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [loading, setLoading] = useState(false);

    // BUSCAR
    const carregarJogosByBolaoID = useCallback(async () => {
        // Se não tiver ID, limpa a lista de jogos específicos e sai
        if (!bolaoId) {
            setJogos([]);
            return;
        }
        try {
            const j = await JogosService.getByBolaoId(bolaoId);
            setJogos(j);
        } catch (error) {
            console.error("Erro ao carregar jogos", error);
        }
    }, [bolaoId]);

    // Carregar todos os jogos do sistema
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
        if (!bolaoId) {
            alert("Necessário selecionar um bolão para adicionar jogos.");
            return;
        }
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

    const deleteJogo = async (jogoId: string) => {
        if (!bolaoId) return;
        try {
            setLoading(true);
            await JogosService.delete(bolaoId, jogoId);
            await carregarJogosByBolaoID();
        } catch (error: any) {
            alert("Erro ao deletar jogo: " + (error.message || ""));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(bolaoId){
            carregarJogosByBolaoID();
        }else{
            carregarJogos();
        }
    }, [carregarJogosByBolaoID, carregarJogos, bolaoId]);

    return { 
        jogos, 
        addJogo, 
        deleteJogo,
        loading,
        todosJogos,
        carregarJogos,
        refresh: carregarJogosByBolaoID 
    };
}