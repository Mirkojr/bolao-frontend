import { useState, useEffect } from "react";
import { BolaoService} from "../services/bolao-service";
import type { Jogo } from "../../../shared/interfaces/jogo";
import type { Participante } from "../../../shared/interfaces/participante";
import type { Palpite } from "../../../shared/interfaces/palpite";

export const useBolaoEdicao = (bolaoId: string | undefined) => {
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [palpites, setPalpites] = useState<Palpite[]>([]);
    const [loading, setLoading] = useState(true);

    const carregarDados = async () => {
        if (!bolaoId) return;
        setLoading(true);
        try {
            const [j, part, palp] = await Promise.all([
                BolaoService.getJogos(bolaoId),
                BolaoService.getParticipantes(bolaoId),
                BolaoService.getPalpites(bolaoId)
            ]);
            console.log("Dados carregados:", { jogos: j, participantes: part, palpites: palp });
            setJogos(j);
            setParticipantes(part);
            setPalpites(palp);
        } catch (error) {
            console.error("Erro ao carregar detalhes do bolão:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, [bolaoId]);

    return { jogos, participantes, palpites, loading, refresh: carregarDados };
};