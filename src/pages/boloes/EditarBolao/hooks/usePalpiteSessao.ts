import { useState, useCallback, useMemo, useEffect } from "react";
import { palpitesService } from "@/shared/services/palpite-service";
import type { Jogo } from "@/shared/interfaces/jogo";
import type { Palpite } from "@/shared/interfaces/palpite";

export interface Rascunho { a: number; b: number }

interface Params {
    bolaoId: string;
    participanteId: number | null;
    jogos: Jogo[];
    getPalpite: (partId: number | string, jogoId: number | string) => Palpite | undefined;
}

export const usePalpiteSessao = ({ bolaoId, participanteId, jogos, getPalpite }: Params) => {
    const [rascunhos, setRascunhos] = useState<Record<number, Rascunho>>({});
    const [tocados, setTocados] = useState<Set<number>>(new Set());
    const [indice, setIndice] = useState(0);
    const [salvando, setSalvando] = useState(false);
    const [progresso, setProgresso] = useState(0);
    const [erro, setErro] = useState<string | null>(null);

    // Ao trocar de participante, recarrega os rascunhos a partir do que já está salvo
    useEffect(() => {
        if (participanteId === null) return;
        const iniciais: Record<number, Rascunho> = {};
        jogos.forEach((j) => {
            const p = getPalpite(participanteId, j.id);
            iniciais[j.id] = { a: p?.gol_a_palpite ?? 0, b: p?.gol_b_palpite ?? 0 };
        });
        setRascunhos(iniciais);
        setTocados(new Set());
        setErro(null);
        setProgresso(0);
        // abre direto no primeiro jogo ainda sem palpite
        const primeiroVazio = jogos.findIndex((j) => !getPalpite(participanteId, j.id));
        setIndice(primeiroVazio >= 0 ? primeiroVazio : 0);
    }, [participanteId, jogos, getPalpite]);

    const definir = useCallback((jogoId: number, valores: Partial<Rascunho>) => {
        setRascunhos((prev) => ({ ...prev, [jogoId]: { ...prev[jogoId], ...valores } }));
        setTocados((prev) => new Set(prev).add(jogoId));
    }, []);

    const jogoAtual = jogos[indice];
    const total = jogos.length;

    const preenchidos = useMemo(() => {
        if (participanteId === null) return 0;
        return jogos.filter((j) => tocados.has(j.id) || getPalpite(participanteId, j.id)).length;
    }, [jogos, tocados, participanteId, getPalpite]);

    const pendentes = tocados.size;

    const irPara = useCallback(
        (novo: number) => setIndice(Math.min(total - 1, Math.max(0, novo))),
        [total]
    );

    const salvar = useCallback(async () => {
        if (participanteId === null || tocados.size === 0) return true;
        setSalvando(true);
        setErro(null);
        setProgresso(0);

        const lista = [...tocados];
        try {
            // sequencial de propósito: evita rajada de requisições e o 429
            for (let i = 0; i < lista.length; i++) {
                const jogoId = lista[i];
                const r = rascunhos[jogoId];
                await palpitesService.save(bolaoId, {
                    participante_id: String(participanteId),
                    jogo_id: String(jogoId),
                    gol_a_palpite: r.a,
                    gol_b_palpite: r.b,
                });
                setProgresso(Math.round(((i + 1) / lista.length) * 100));
            }
            setTocados(new Set());
            return true;
        } catch (e: any) {
            setErro(e?.message ?? "Não foi possível salvar todos os palpites.");
            return false;
        } finally {
            setSalvando(false);
        }
    }, [bolaoId, participanteId, tocados, rascunhos]);

    return {
        rascunhos, definir, indice, irPara, jogoAtual, total,
        preenchidos, pendentes, salvar, salvando, progresso, erro,
    };
};