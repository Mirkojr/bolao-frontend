import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Jogo } from "@/shared/interfaces/jogo";
import {
    FILTROS_PADRAO, type JogoCounts, type JogoFiltros,
    type JogoPeriodo, type JogoSort, type JogoStatus,
} from "@/shared/interfaces/jogo-filtros";
import { jogosService } from "@/shared/services/jogos-service";

const LIMITE = 10;

export const useJogosPaginado = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // --- estado derivado da URL (permite compartilhar/favoritar/voltar) ------
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const filtros = useMemo<JogoFiltros>(() => ({
        search: searchParams.get("search") ?? "",
        status: (searchParams.get("status") as JogoStatus) ?? FILTROS_PADRAO.status,
        periodo: (searchParams.get("periodo") as JogoPeriodo) ?? FILTROS_PADRAO.periodo,
        sort: (searchParams.get("sort") as JogoSort) ?? FILTROS_PADRAO.sort,
    }), [searchParams]);

    // input de busca é local (digitação) e vai pra URL com debounce
    const [searchInput, setSearchInput] = useState(filtros.search);

    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [counts, setCounts] = useState<JogoCounts>({
        todos: 0, agendados: 0, finalizados: 0, pendentes: 0,
    });

    const primeiraRenderizacao = useRef(true);

    /** escreve na URL, removendo o que está no valor padrão */
    const aplicarParams = useCallback((novos: Partial<JogoFiltros & { page: number }>) => {
        setSearchParams((atual) => {
            const p = new URLSearchParams(atual);
            const set = (chave: string, valor: string, padrao: string) => {
                if (!valor || valor === padrao) p.delete(chave);
                else p.set(chave, valor);
            };

            if (novos.search !== undefined) set("search", novos.search, "");
            if (novos.status !== undefined) set("status", novos.status, FILTROS_PADRAO.status);
            if (novos.periodo !== undefined) set("periodo", novos.periodo, FILTROS_PADRAO.periodo);
            if (novos.sort !== undefined) set("sort", novos.sort, FILTROS_PADRAO.sort);

            // qualquer mudança de filtro volta pra página 1
            const mudouFiltro = novos.page === undefined;
            const novaPagina = mudouFiltro ? 1 : novos.page!;
            if (novaPagina <= 1) p.delete("page");
            else p.set("page", String(novaPagina));

            return p;
        }, { replace: true });
    }, [setSearchParams]);

    // --- debounce da busca ---------------------------------------------------
    useEffect(() => {
        if (primeiraRenderizacao.current) return;
        const t = setTimeout(() => {
            if (searchInput !== filtros.search) aplicarParams({ search: searchInput });
        }, 400);
        return () => clearTimeout(t);
    }, [searchInput, filtros.search, aplicarParams]);

    // --- carregamento --------------------------------------------------------
    const carregar = useCallback(async () => {
        setLoading(true);
        try {
            const resp = await jogosService.listar(page, LIMITE, filtros);
            setJogos(resp.data ?? []);
            setTotal(resp.pagination?.total ?? 0);
            setTotalPages(resp.pagination?.totalPages ?? 1);
            if (resp.counts) setCounts(resp.counts);
        } catch (e) {
            console.error("Erro ao carregar jogos:", e);
            setJogos([]);
        } finally {
            setLoading(false);
            primeiraRenderizacao.current = false;
        }
    }, [page, filtros]);

    useEffect(() => { carregar(); }, [carregar]);

    // --- ações ---------------------------------------------------------------
    const criarJogo = async (dados: Parameters<typeof jogosService.create>[0]) => {
        await jogosService.create(dados);
        await carregar();
    };

    const atualizarJogo = async (id: string, dados: Record<string, unknown>) => {
        await jogosService.update(id, dados);
        await carregar();
    };

    const deletarJogo = async (id: string) => {
        await jogosService.deleteGlobal(id);
        // se apagou o último item da página, volta uma
        if (jogos.length === 1 && page > 1) aplicarParams({ page: page - 1 });
        else await carregar();
    };

    const salvarResultado = async (id: string, golA: number | null, golB: number | null) => {
        await jogosService.setResultado(id, golA, golB);
        await carregar();
    };

    // --- API do hook ---------------------------------------------------------
    return {
        jogos, loading, total, totalPages, counts,
        page,
        setPage: (p: number) => aplicarParams({ page: p }),

        filtros,
        searchInput,
        setSearchInput,
        setStatus: (status: JogoStatus) => aplicarParams({ status }),
        setPeriodo: (periodo: JogoPeriodo) => aplicarParams({ periodo }),
        setSort: (sort: JogoSort) => aplicarParams({ sort }),
        limparFiltros: () => {
            setSearchInput("");
            aplicarParams({ ...FILTROS_PADRAO });
        },

        criarJogo, atualizarJogo, deletarJogo, salvarResultado, recarregar: carregar,
    };
};