import { useState, useEffect } from "react";
import type { Bolao } from "../../../shared/interfaces/bolao";
import { BoloesService } from "../../../shared/services/bolao-service";

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
        refetch: carregarBoloes 
    };
};