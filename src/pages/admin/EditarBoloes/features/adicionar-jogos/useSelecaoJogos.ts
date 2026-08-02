import { useCallback, useEffect, useMemo, useState } from "react";
import type { Jogo } from "@/shared/interfaces/jogo";
import { jogosService } from "@/shared/services/jogos-service";
import {
    FILTROS_PADRAO, contarFiltrosAtivos,
    type JogoFiltros, type JogoPeriodo, type JogoSort, type JogoStatus,
} from "@/shared/interfaces/jogo-filtros";

const LIMITE = 12;

interface Params {
    bolaoId: string;
    isOpen: boolean;
    jogosNoBolao: Jogo[];
    reloadToken: number;
}

export const useSelecaoJogos = ({ bolaoId, isOpen, jogosNoBolao, reloadToken }: Params) => {
    const [searchInput, setSearchInput] = useState("");
    // filtro padrão do modal: jogos que ainda vão acontecer (o caso de uso real)
    const [filtros, setFiltros] = useState<JogoFiltros>({ ...FILTROS_PADRAO, periodo: "futuros" });
    const [page, setPage] = useState(1);

    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
    const [ocultarAdicionados, setOcultarAdicionados] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [progresso, setProgresso] = useState(0);

    const idsNoBolao = useMemo(() => new Set(jogosNoBolao.map((j) => j.id)), [jogosNoBolao]);

    // debounce de verdade: só a busca "aplicada" dispara requisição
    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            setFiltros((f) => (f.search === searchInput ? f : { ...f, search: searchInput }));
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [searchInput, isOpen]);

    // limpa o estado ao reabrir
    useEffect(() => {
        if (!isOpen) {
            setSelecionados(new Set());
            setErro(null);
            setProgresso(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        let ativo = true;
        setLoading(true);
        setErro(null);

        jogosService
            .listar(page, LIMITE, filtros)
            .then((res) => {
                if (!ativo) return;
                setJogos(res.data ?? []);
                setTotal(res.pagination?.total ?? 0);
                setTotalPages(res.pagination?.totalPages ?? 1);
            })
            .catch((e: any) => {
                if (!ativo) return;
                setJogos([]);
                setErro(e?.message ?? "Não foi possível carregar os jogos.");
            })
            .finally(() => { if (ativo) setLoading(false); });

        return () => { ativo = false; };
    }, [isOpen, page, filtros, reloadToken]);

    const visiveis = useMemo(
        () => (ocultarAdicionados ? jogos.filter((j) => !idsNoBolao.has(j.id)) : jogos),
        [jogos, ocultarAdicionados, idsNoBolao]
    );

    const alternar = useCallback((id: number) => {
        setSelecionados((prev) => {
            const novo = new Set(prev);
            novo.has(id) ? novo.delete(id) : novo.add(id);
            return novo;
        });
    }, []);

    const selecionarPagina = useCallback(() => {
        const disponiveis = visiveis.filter((j) => !idsNoBolao.has(j.id)).map((j) => j.id);
        const todosMarcados = disponiveis.every((id) => selecionados.has(id));
        setSelecionados((prev) => {
            const novo = new Set(prev);
            disponiveis.forEach((id) => (todosMarcados ? novo.delete(id) : novo.add(id)));
            return novo;
        });
    }, [visiveis, idsNoBolao, selecionados]);

    /** adiciona sequencialmente — evita rajada de POST e o rate limit */
    const adicionarSelecionados = useCallback(async () => {
        const lista = [...selecionados];
        if (lista.length === 0) return true;

        setSalvando(true);
        setErro(null);
        setProgresso(0);
        try {
            for (let i = 0; i < lista.length; i++) {
                await jogosService.addJogoToBolao(bolaoId, String(lista[i]));
                setProgresso(Math.round(((i + 1) / lista.length) * 100));
            }
            setSelecionados(new Set());
            return true;
        } catch (e: any) {
            setErro(e?.message ?? "Alguns jogos não puderam ser adicionados.");
            return false;
        } finally {
            setSalvando(false);
        }
    }, [selecionados, bolaoId]);

    return {
        searchInput, setSearchInput,
        filtros,
        setStatus: (status: JogoStatus) => { setFiltros((f) => ({ ...f, status })); setPage(1); },
        setPeriodo: (periodo: JogoPeriodo) => { setFiltros((f) => ({ ...f, periodo })); setPage(1); },
        setSort: (sort: JogoSort) => { setFiltros((f) => ({ ...f, sort })); setPage(1); },
        limparFiltros: () => { setSearchInput(""); setFiltros({ ...FILTROS_PADRAO }); setPage(1); },
        filtrosAtivos: contarFiltrosAtivos(filtros),

        jogos: visiveis, brutos: jogos, total, totalPages, page, setPage,
        loading, erro,

        idsNoBolao,
        selecionados, alternar, selecionarPagina,
        ocultarAdicionados, setOcultarAdicionados,
        adicionarSelecionados, salvando, progresso,
    };
};