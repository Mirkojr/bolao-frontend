import { BottomSheetModal } from "@/shared/components/BottomSheetModal";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Pagination } from "@/shared/components/Pagination";
import { rotuloDataHora } from "@/shared/utils/data-jogo";
import { PERIODO_LABEL, SORT_LABEL, type JogoPeriodo, type JogoSort } from "@/shared/interfaces/jogo-filtros";
import type { Jogo } from "@/shared/interfaces/jogo";
import { useSelecaoJogos } from "./useSelecaoJogos";

const PERIODOS: JogoPeriodo[] = ["futuros", "semana", "hoje", "passados", "sem_data", "todos"];
const ORDENS: JogoSort[] = ["proximos", "data_asc", "data_desc", "recentes"];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    bolaoId: string;
    jogosNoBolao: Jogo[];
    onAdicionado: () => Promise<void> | void;
    onCriarNovo: () => void;
    reloadToken?: number;
}

export const AdicionarJogosModal = ({
    isOpen, onClose, bolaoId, jogosNoBolao, onAdicionado, onCriarNovo, reloadToken = 0,
}: Props) => {
    const s = useSelecaoJogos({ bolaoId, isOpen, jogosNoBolao, reloadToken });

    const confirmar = async () => {
        const ok = await s.adicionarSelecionados();
        if (ok) { await onAdicionado(); onClose(); }
    };

    const fechar = () => {
        if (s.salvando) return;
        if (s.selecionados.size > 0 && !confirm(`Descartar ${s.selecionados.size} jogo(s) selecionado(s)?`)) return;
        onClose();
    };

    return (
        <BottomSheetModal
            isOpen={isOpen}
            onClose={fechar}
            title="Adicionar jogos ao bolão"
            tall
            flushBody
            footer={
                s.salvando ? (
                    <div className="space-y-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                            <div className="h-full bg-green-500 transition-all" style={{ width: `${s.progresso}%` }} />
                        </div>
                        <p className="text-center text-sm text-gray-500">Adicionando… {s.progresso}%</p>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onCriarNovo} className="whitespace-nowrap">
                            + Criar jogo
                        </Button>
                        <Button onClick={confirmar} disabled={s.selecionados.size === 0}>
                            {s.selecionados.size === 0
                                ? "Selecione os jogos"
                                : `Adicionar ${s.selecionados.size} jogo${s.selecionados.size > 1 ? "s" : ""}`}
                        </Button>
                    </div>
                )
            }
        >
            {/* Contexto + busca + filtros */}
            <div className="sticky top-0 z-10 space-y-3 border-b border-gray-100 bg-white p-4">
                <p className="text-xs text-gray-500">
                    Este bolão já tem <b>{jogosNoBolao.length}</b> jogo(s).
                </p>

                <Input
                    fullWidth
                    placeholder="Buscar por time (ex: Flamengo)…"
                    value={s.searchInput}
                    onChange={(e) => s.setSearchInput(e.target.value)}
                />

                {/* Chips de período */}
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
                    {PERIODOS.map((p) => {
                        const ativo = s.filtros.periodo === p;
                        return (
                            <button
                                key={p}
                                onClick={() => s.setPeriodo(p)}
                                className={`h-9 shrink-0 rounded-full px-3 text-sm font-medium transition
                                    ${ativo ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 active:bg-gray-200"}`}
                            >
                                {PERIODO_LABEL[p]}
                            </button>
                        );
                    })}
                </div>

                {/* Ordenação + ocultar adicionados */}
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={s.filtros.sort}
                        onChange={(e) => s.setSort(e.target.value as JogoSort)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700"
                    >
                        {ORDENS.map((o) => (
                            <option key={o} value={o}>{SORT_LABEL[o]}</option>
                        ))}
                    </select>

                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={s.ocultarAdicionados}
                            onChange={(e) => s.setOcultarAdicionados(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        Ocultar já adicionados
                    </label>

                    {(s.filtrosAtivos > 0 || s.searchInput) && (
                        <button onClick={s.limparFiltros} className="text-sm font-medium text-blue-600">
                            Limpar
                        </button>
                    )}
                </div>

                {s.jogos.length > 0 && (
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{s.total} jogo(s) encontrados</span>
                        <button onClick={s.selecionarPagina} className="font-medium text-blue-600">
                            Selecionar todos desta página
                        </button>
                    </div>
                )}
            </div>

            {/* Lista */}
            <div className="p-4">
                {s.erro ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                        <p className="text-sm text-red-700">{s.erro}</p>
                        <button onClick={() => s.setPage(s.page)} className="mt-2 text-sm font-semibold text-red-700 underline">
                            Tentar novamente
                        </button>
                    </div>
                ) : s.loading ? (
                    <p className="py-8 text-center text-gray-500">Carregando jogos…</p>
                ) : s.jogos.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-gray-500">
                            {s.ocultarAdicionados && s.brutos.length > 0
                                ? "Todos os jogos desta página já estão no bolão."
                                : "Nenhum jogo encontrado com esses filtros."}
                        </p>
                        <button onClick={onCriarNovo} className="mt-3 text-sm font-semibold text-blue-600">
                            Criar um jogo novo
                        </button>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {s.jogos.map((jogo) => {
                            const jaAdicionado = s.idsNoBolao.has(jogo.id);
                            const marcado = s.selecionados.has(jogo.id);

                            return (
                                <li key={jogo.id}>
                                    <button
                                        type="button"
                                        disabled={jaAdicionado}
                                        onClick={() => s.alternar(jogo.id)}
                                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition
                                            ${jaAdicionado
                                                ? "border-gray-100 bg-gray-50 opacity-60"
                                                : marcado
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 active:bg-gray-50"}`}
                                    >
                                        <span
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold
                                                ${marcado ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"}`}
                                        >
                                            {marcado ? "✓" : ""}
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate font-medium text-gray-800">
                                                {jogo.timeA?.nome ?? "Time A"}{" "}
                                                <span className="text-gray-400">×</span>{" "}
                                                {jogo.timeB?.nome ?? "Time B"}
                                            </span>
                                            <span className="block text-xs text-gray-500">
                                                {jogo.data_jogo ? rotuloDataHora(jogo.data_jogo) : "Data a definir"}
                                                {jogo.status === "FINALIZADO" && jogo.gol_a_real != null && (
                                                    <> · <b className="tabular-nums">{jogo.gol_a_real}-{jogo.gol_b_real}</b></>
                                                )}
                                            </span>
                                        </span>

                                        {jaAdicionado && (
                                            <span className="shrink-0 text-xs font-medium text-green-600">no bolão</span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {s.totalPages > 1 && (
                    <div className="pt-4">
                        <Pagination page={s.page} totalPages={s.totalPages} onPageChange={s.setPage} />
                    </div>
                )}
            </div>
        </BottomSheetModal>
    );
};