import { useState, useEffect, useCallback } from "react";
import type { Jogo } from "@/shared/interfaces/jogo";
import { jogosService } from "@/shared/services/jogos-service";

const LIMIT = 10;

export const useJogosPaginado = () => {
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchDebounced, setSearchDebounced] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => { setSearchDebounced(search); setPage(1); }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const carregar = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const res = await jogosService.getPaginated({ page, limit: LIMIT, search: searchDebounced });
            setJogos(res.data);
            setTotalPages(res.pagination.totalPages);
            setTotal(res.pagination.total);
        } catch (error) {
            console.error("Erro ao carregar jogos:", error);
        } finally {
            setLoading(false);
        }
    }, [page, searchDebounced]);

    useEffect(() => { carregar(); }, [carregar]);

    const criarJogo = async (dados: { time_a_id: number; time_b_id: number; data_jogo: string }) => {
        await jogosService.create(dados);
        await carregar(true);
    };
    const atualizarJogo = async (id: string, dados: Partial<Jogo>) => {
        await jogosService.update(id, dados);
        await carregar(true);
    };
    const deletarJogo = async (id: string) => {
        await jogosService.deleteGlobal(id);
        await carregar(true);
    };

    return {
        jogos, loading,
        page, setPage, totalPages, total,
        search, setSearch,
        criarJogo, atualizarJogo, deletarJogo,
        refetch: carregar,
    };
};