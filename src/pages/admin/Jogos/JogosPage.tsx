import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Jogo } from "@/shared/interfaces/jogo";
import { useJogosPaginado } from "@/shared/hooks/useJogosPaginado";
import { useTimes } from "@/shared/hooks/useTimes";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Pagination } from "@/shared/components/Pagination";
import { rotuloDataHora } from "@/shared/utils/data-jogo";
import { contarFiltrosAtivos } from "@/shared/interfaces/jogo-filtros";
import { JogoFormModal, type JogoFormData } from "./components/JogoFormModal";
import { ResultadoModal } from "./components/ResultadoModal";
import { JogosFiltros } from "./components/JogosFiltros";

export const JogosPage = () => {
    const { isAuthenticated } = useAuth();

    const {
        jogos, loading, page, setPage, totalPages, total, counts,
        filtros, searchInput, setSearchInput,
        setStatus, setPeriodo, setSort, limparFiltros,
        criarJogo, atualizarJogo, deletarJogo, salvarResultado,
    } = useJogosPaginado();

    const { allTeams, carregarTimes } = useTimes();

    const [formOpen, setFormOpen] = useState(false);
    const [jogoEditando, setJogoEditando] = useState<Jogo | null>(null);
    const [jogoResultado, setJogoResultado] = useState<Jogo | null>(null);

    useEffect(() => { carregarTimes(); }, [carregarTimes]);

    if (!isAuthenticated) {
        return <div className="p-6 text-red-500">Acesso negado. Faça login como administrador.</div>;
    }

    const temFiltro = contarFiltrosAtivos(filtros) > 0 || !!filtros.search;

    const abrirCriar = () => { setJogoEditando(null); setFormOpen(true); };
    const abrirEditar = (j: Jogo) => { setJogoEditando(j); setFormOpen(true); };

    const handleSubmit = async (dados: JogoFormData) => {
        if (jogoEditando) await atualizarJogo(String(jogoEditando.id), dados);
        else await criarJogo(dados);
    };

    const handleDelete = async (j: Jogo) => {
        const nome = `${j.timeA?.nome ?? "Time A"} vs ${j.timeB?.nome ?? "Time B"}`;
        if (confirm(`Excluir o jogo "${nome}"? Essa ação não pode ser desfeita.`)) {
            await deletarJogo(String(j.id));
        }
    };

    return (
        <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-6 sm:px-6 sm:pb-10">
            {/* Cabeçalho */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Jogos</h1>
                    <p className="text-sm text-gray-500">
                        {loading ? "Carregando..." : `${total} jogo(s) ${temFiltro ? "no filtro atual" : "cadastrado(s)"}`}
                    </p>
                </div>
                <Button variant="success" onClick={abrirCriar} className="hidden sm:inline-flex">
                    + Novo jogo
                </Button>
            </div>

            {/* Aviso de pendências */}
            {counts.pendentes > 0 && filtros.status === "todos" && (
                <button
                    onClick={() => { setStatus("agendado"); setPeriodo("passados"); }}
                    className="mb-3 flex w-full items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-800 transition active:scale-[0.99]"
                >
                    <span>⚠️</span>
                    <span className="flex-1">
                        <b>{counts.pendentes}</b> jogo(s) já aconteceram e estão sem resultado.
                    </span>
                    <span className="text-xs font-semibold underline">Ver</span>
                </button>
            )}

            {/* Busca */}
            <div className="mb-3">
                <Input
                    fullWidth
                    placeholder="Buscar por time..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            </div>

            {/* Filtros */}
            <JogosFiltros
                filtros={filtros}
                counts={counts}
                onStatus={setStatus}
                onPeriodo={setPeriodo}
                onSort={setSort}
                onLimpar={limparFiltros}
            />

            {/* Lista */}
            {loading ? (
                <p className="py-10 text-center text-gray-500">Carregando jogos...</p>
            ) : jogos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center">
                    <p className="mb-3 text-gray-500">
                        {temFiltro ? "Nenhum jogo encontrado com esses filtros." : "Nenhum jogo cadastrado ainda."}
                    </p>
                    {temFiltro ? (
                        <Button variant="secondary" size="sm" onClick={limparFiltros}>Limpar filtros</Button>
                    ) : (
                        <Button variant="success" size="sm" onClick={abrirCriar}>+ Criar o primeiro jogo</Button>
                    )}
                </div>
            ) : (
                <>
                    <p className="mb-2 text-xs text-gray-400">
                        Toque em um jogo para lançar ou editar o resultado.
                    </p>
                    <ul className="space-y-2">
                        {jogos.map((j) => {
                            const finalizado = j.gol_a_real !== null && j.gol_a_real !== undefined;
                            const atrasado = !finalizado && !!j.data_jogo && new Date(j.data_jogo) < new Date();

                            return (
                                <li key={j.id}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setJogoResultado(j)}
                                        onKeyDown={(e) => e.key === "Enter" && setJogoResultado(j)}
                                        className={`w-full cursor-pointer rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow active:scale-[0.99]
                                            ${atrasado ? "border-amber-300" : "border-gray-200 hover:border-indigo-300"}`}
                                    >
                                        {/* Confronto */}
                                        <div className="flex items-center gap-2">
                                            <span className="min-w-0 flex-1 truncate text-right text-sm font-semibold text-gray-800">
                                                {j.timeA?.nome ?? "Time A"}
                                            </span>
                                            <span className={`shrink-0 rounded-lg px-3 py-1 text-base font-bold tabular-nums ${
                                                finalizado ? "bg-indigo-900 text-white" : "bg-gray-100 text-gray-400"
                                            }`}>
                                                {finalizado ? `${j.gol_a_real} - ${j.gol_b_real}` : "X"}
                                            </span>
                                            <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-gray-800">
                                                {j.timeB?.nome ?? "Time B"}
                                            </span>
                                        </div>

                                        {/* Meta + ações */}
                                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                                    finalizado ? "bg-gray-100 text-gray-600"
                                                    : atrasado ? "bg-amber-100 text-amber-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}>
                                                    {finalizado ? "Finalizado" : atrasado ? "Sem resultado" : "Agendado"}
                                                </span>
                                                <span className="truncate text-xs text-gray-500">
                                                    {rotuloDataHora(j.data_jogo)}
                                                </span>
                                            </div>

                                            <div className="flex shrink-0 gap-1">
                                                <button aria-label="Editar jogo"
                                                    onClick={(e) => { e.stopPropagation(); abrirEditar(j); }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600">
                                                    ✎
                                                </button>
                                                <button aria-label="Excluir jogo"
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(j); }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600">
                                                    🗑
                                                </button>
                                            </div>
                                        </div>

                                        {!finalizado && (
                                            <p className={`mt-2 text-center text-[11px] font-medium ${
                                                atrasado ? "text-amber-600" : "text-indigo-600"
                                            }`}>
                                                + Lançar resultado
                                            </p>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

            {/* FAB mobile */}
            <button
                onClick={abrirCriar}
                aria-label="Novo jogo"
                className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-3xl font-light text-white shadow-lg active:scale-95 sm:hidden"
            >
                +
            </button>

            <JogoFormModal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                times={allTeams}
                jogoEditando={jogoEditando}
                onSubmit={handleSubmit}
            />

            <ResultadoModal
                isOpen={!!jogoResultado}
                onClose={() => setJogoResultado(null)}
                jogo={jogoResultado}
                onSalvar={salvarResultado}
            />
        </div>
    );
};

export default JogosPage;