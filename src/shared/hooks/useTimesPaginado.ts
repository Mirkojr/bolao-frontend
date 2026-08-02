import { useState, useEffect, useCallback } from "react";
import type { Time } from "@/shared/interfaces/time";
import { timeService } from "@/shared/services/time-service";

const LIMIT = 10;

export const useTimesPaginado = () => {
    const [times, setTimes] = useState<Time[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchDebounced, setSearchDebounced] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // debounce -> volta pra página 1
    useEffect(() => {
        const t = setTimeout(() => { setSearchDebounced(search); setPage(1); }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const carregar = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const res = await timeService.getPaginated({ page, limit: LIMIT, search: searchDebounced });
            setTimes(res.data);
            setTotalPages(res.pagination.totalPages);
            setTotal(res.pagination.total);
        } catch (error) {
            console.error("Erro ao carregar times:", error);
        } finally {
            setLoading(false);
        }
    }, [page, searchDebounced]);

    useEffect(() => { carregar(); }, [carregar]);

    const criarTime = async (dados: Partial<Time>) => {
        await timeService.add(dados);
        await carregar(true);
    };
    const atualizarTime = async (id: string, dados: Partial<Time>) => {
        await timeService.update(id, dados);
        await carregar(true);
    };
    const deletarTime = async (id: string) => {
        await timeService.delete(id);
        await carregar(true);
    };

    return {
        times, loading,
        page, setPage, totalPages, total,
        search, setSearch,
        criarTime, atualizarTime, deletarTime,
        refetch: carregar,
    };
};