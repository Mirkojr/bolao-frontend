import { useState, useEffect } from "react";
import type { Bolao } from "@/shared/interfaces/bolao";
import { BoloesService } from "@/shared/services/bolao-service";

// Hook para gerenciar a lista de bolões, criação, deleção e atualização
export const useBoloes = () => {
    const [boloes, setBoloes] = useState<Bolao[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const carregarBoloes = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const dados = await BoloesService.getAll();
            setBoloes(dados);
        } catch (error) {
            console.error("Erro ao carregar bolões:", error);
        } finally {
            setLoading(false);
        }
    };

    const getBolaoById = async (id: number ): Promise<Bolao | undefined> => {
        // Tenta achar na memória
        const localBolao = boloes.find(b => b.id == id);
        
        if (localBolao) {
            return localBolao; // Retorno imediato se já tiver
        }

        // Se não achou busca individualmente na API
        try {
            const bolaoDaApi = await BoloesService.getById(id);
            return bolaoDaApi;
        } catch (error) {
            console.error(`Erro ao buscar bolão ${id}:`, error);
            return undefined;
        }
    };

    const criarBolao = async (nome: string) => {
        setCreating(true);
        try {
            await BoloesService.create({ nome });
            await carregarBoloes(true);
        } catch(error) {
            console.error("Erro ao criar bolão:", error);
        } finally {
            setCreating(false);
        }
    };

    useEffect(() => {
        carregarBoloes();
    }, []);

    return { 
        boloes, 
        loading, 
        criarBolao, 
        creating,
        getBolaoById,
        refetch: carregarBoloes 
    };
};