import { useState, useEffect, useCallback, useMemo } from "react";
import type { Jogo } from "@/shared/interfaces/jogo";
import { jogosService } from "@/shared/services/jogos-service";

export type StatusFilter = 'todos' |'finalizado' | 'agendado'
export type OrdemFilter = 'crescente' | 'decrescente';

export const useJogos = (bolaoId: string | null = null) => {
    
    const [ todosJogos, setTodosJogos ] = useState<Jogo[]>([]);
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [loading, setLoading] = useState(false);

    const [filtroStatus, setFiltroStatus] = useState<StatusFilter>('todos');
    const [filtroData, setFiltroData] = useState<string>('');

    const [ordem, setOrdem] = useState<OrdemFilter>('decrescente');

    // FUNÇÃO DE FILTRAGEM
    const filtrarLista = useCallback((lista: Jogo[]) => {
        return lista.filter((jogo) => {
            if (filtroData) {
                if(!jogo.data_jogo || !jogo.data_jogo.toString().startsWith(filtroData)){
                    return false;
                }
            }
            if (filtroStatus !== 'todos'){
                const isFinalizado = jogo.gol_a_real !== null && jogo.gol_a_real !== undefined;

                if (filtroStatus === 'finalizado' && !isFinalizado) return false;
                if (filtroStatus === 'agendado' && isFinalizado) return false;
            }   

            return true;
        })
    }, [filtroData, filtroStatus]);

    // FUNÇAO DE ORDENAR A LISTA
    const ordenarLista = useCallback((lista: Jogo[]) => {
        return lista.sort((a, b) => {
            const dataA = new Date(a.data_jogo || 0).getTime();
            const dataB = new Date(b.data_jogo || 0).getTime();

            if (ordem === 'decrescente') {
                return dataB - dataA; // Mais recentes primeiro
            } else {
                return dataA - dataB; // Mais antigos primeiro
            }
        });
    }, [ordem]);

    // LISTAS FILTRADAS
    const jogosFiltrados = useMemo(() => {
        const filtrados = filtrarLista([...jogos]); // [...jogos] cria cópia para não mutar o original
        return ordenarLista(filtrados);
    }, [jogos, filtrarLista, ordenarLista]);

    const todosJogosFiltrados = useMemo(() => {
        const filtrados = filtrarLista([...todosJogos]);
        return ordenarLista(filtrados);
    }, [todosJogos, filtrarLista, ordenarLista]);

    // BUSCAR
    const carregarJogosByBolaoID = useCallback(async () => {
        // Se não tiver ID, limpa a lista de jogos específicos e sai
        if (!bolaoId) {
            setJogos([]);
            return;
        }
        try {
            const j = await jogosService.getByBolaoId(bolaoId);
            setJogos(j);
        } catch (error) {
            console.error("Erro ao carregar jogos", error);
        }
    }, [bolaoId]);

    // Carregar todos os jogos do sistema
    const carregarJogos = useCallback(async () => {
        setLoading(true);
        try {
            const j = await jogosService.getAll();
            setTodosJogos(j);
        } catch (error) {
            console.error("Erro ao carregar jogos", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // ADICIONAR UM JOGO QUALQUER
    const addJogo = async (timeA: string, timeB: string) => {
        try {
            setLoading(true);
            await jogosService.add(timeA, timeB);
            await carregarJogos();
        } catch (error: any) {
            alert("Erro ao adicionar jogo: " + (error.message || ""));
        } finally {
            setLoading(false);
        }
    };

    const addJogoToBolao = async (jogoId: string) => {
        if (!bolaoId) return;
        try {
            setLoading(true);
            await jogosService.addJogoToBolao(bolaoId, jogoId);
            await carregarJogosByBolaoID();
        } catch (error: any) {
            alert("Erro ao adicionar jogo ao bolão: " + (error.message || ""));
        }
        finally {
            setLoading(false);
        }
    };

    const deleteJogo = async (jogoId: string) => {
        if (!bolaoId) return;
        try {
            setLoading(true);
            await jogosService.delete(bolaoId, jogoId);
            await carregarJogosByBolaoID();
        } catch (error: any) {
            alert("Erro ao deletar jogo: " + (error.message || ""));
        } finally {
            setLoading(false);
        }
    };

    const updateJogo = async (jogoId: string, dadosJogo: Partial<Jogo>) => {
        try {
            setLoading(true);
            await jogosService.update(jogoId, dadosJogo);
            await carregarJogos();
            await carregarJogosByBolaoID();
        } catch (error: any) {
            alert("Erro ao atualizar jogo: " + (error.message || ""));
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
        // Listas já filtradas
        jogos: jogosFiltrados, 
        todosJogos: todosJogosFiltrados,

        // Dados brutos
        totalJogosCount: jogos.length,

        // Ações
        addJogo, 
        addJogoToBolao,
        deleteJogo,
        loading,
        carregarJogos,
        refresh: carregarJogosByBolaoID,
        updateJogo,
        
        // Controles de filtro
        filtros: {
            status: filtroStatus,
            setStatus: setFiltroStatus,
            data: filtroData,
            setData: setFiltroData,
            ordem: ordem,         
            setOrdem: setOrdem
        }
    };
}