import { useState, useEffect, useCallback } from "react";
import type { Bolao } from "@/shared/interfaces/bolao";
import { boloesService } from "@/shared/services/bolao-service";

const LIMIT = 10;

export const useBoloes = () => {
    const [boloes, setBoloes] = useState<Bolao[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const carregarBoloes = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const res = await boloesService.getPaginated({ page, limit: LIMIT });
            setBoloes(res.data);
            setTotalPages(res.pagination.totalPages);
            setTotal(res.pagination.total);
        } catch (error) {
            console.error("Erro ao carregar bolões:", error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    const getBolaoById = async (id: number): Promise<Bolao | undefined> => {
        const localBolao = boloes.find((b) => b.id == id);
        if (localBolao) return localBolao;
        try {
            return await boloesService.getById(id);
        } catch (error) {
            console.error(`Erro ao buscar bolão ${id}:`, error);
            return undefined;
        }
    };

    const criarBolao = async (nome: string) => {
        setCreating(true);
        try {
            await boloesService.create({ nome });
            await carregarBoloes(true); // recarrega a página atual
        } catch (error) {
            console.error("Erro ao criar bolão:", error);
        } finally {
            setCreating(false);
        }
    };

    const deletarBolao = async (id: number) => {
        try {
            await boloesService.delete(id);
            await carregarBoloes(true);
        } catch (error) {
            console.error("Erro ao deletar bolão:", error);
        }
    };

    useEffect(() => {
        carregarBoloes();
    }, [carregarBoloes]);

    return {
        boloes,
        loading,
        criarBolao,
        creating,
        getBolaoById,
        deletarBolao,
        refetch: carregarBoloes,
        // paginação
        page,
        setPage,
        totalPages,
        total,
    };
};