import { useState } from "react";
import { BottomSheetModal } from "@/shared/components/BottomSheetModal";
import { Button } from "@/shared/components/Button";
import {
    contarFiltrosAtivos, PERIODO_LABEL, SORT_LABEL,
    type JogoCounts, type JogoFiltros, type JogoPeriodo,
    type JogoSort, type JogoStatus,
} from "@/shared/interfaces/jogo-filtros";

type Props = {
    filtros: JogoFiltros;
    counts: JogoCounts;
    onStatus: (s: JogoStatus) => void;
    onPeriodo: (p: JogoPeriodo) => void;
    onSort: (s: JogoSort) => void;
    onLimpar: () => void;
};

const OpcaoLista = ({
    ativo, label, onClick,
}: { ativo: boolean; label: string; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex h-12 w-full items-center justify-between rounded-xl px-4 text-left text-sm transition
            ${ativo ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
    >
        {label}
        {ativo && <span>✓</span>}
    </button>
);

export const JogosFiltros = ({
    filtros, counts, onStatus, onPeriodo, onSort, onLimpar,
}: Props) => {
    const [sheetAberto, setSheetAberto] = useState(false);
    const ativos = contarFiltrosAtivos(filtros);

    const abas: Array<{ id: JogoStatus; label: string; n: number }> = [
        { id: "todos", label: "Todos", n: counts.todos },
        { id: "agendado", label: "Agendados", n: counts.agendados },
        { id: "finalizado", label: "Finalizados", n: counts.finalizados },
    ];

    return (
        <>
            {/* Segmented control de status */}
            <div className="mb-3 flex gap-1 rounded-xl bg-gray-100 p-1">
                {abas.map((a) => {
                    const ativo = filtros.status === a.id;
                    return (
                        <button
                            key={a.id}
                            type="button"
                            onClick={() => onStatus(a.id)}
                            className={`flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition sm:text-sm
                                ${ativo ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 active:scale-95"}`}
                        >
                            {a.label}
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums
                                ${ativo ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-500"}`}>
                                {a.n}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Linha de ações */}
            <div className="mb-3 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setSheetAberto(true)}
                    className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition
                        ${ativos > 0
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                >
                    ⚙️ Filtros
                    {ativos > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                            {ativos}
                        </span>
                    )}
                </button>

                <span className="min-w-0 flex-1 truncate text-right text-xs text-gray-400">
                    {SORT_LABEL[filtros.sort]}
                </span>
            </div>

            {/* Chips do que está ativo */}
            {(filtros.periodo !== "todos" || filtros.status !== "todos" || filtros.sort !== "proximos") && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    {filtros.status !== "todos" && (
                        <button onClick={() => onStatus("todos")}
                            className="flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                            {filtros.status === "agendado" ? "Agendados" : "Finalizados"} ✕
                        </button>
                    )}
                    {filtros.periodo !== "todos" && (
                        <button onClick={() => onPeriodo("todos")}
                            className="flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                            {PERIODO_LABEL[filtros.periodo]} ✕
                        </button>
                    )}
                    {filtros.sort !== "proximos" && (
                        <button onClick={() => onSort("proximos")}
                            className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            {SORT_LABEL[filtros.sort]} ✕
                        </button>
                    )}
                    <button onClick={onLimpar} className="text-xs font-medium text-gray-400 underline">
                        Limpar tudo
                    </button>
                </div>
            )}

            {/* Sheet de filtros */}
            <BottomSheetModal
                isOpen={sheetAberto}
                onClose={() => setSheetAberto(false)}
                title="Filtrar e ordenar"
                footer={
                    <div className="flex gap-2">
                        <Button variant="ghost" className="flex-1 text-gray-500"
                            onClick={() => { onLimpar(); setSheetAberto(false); }}>
                            Limpar
                        </Button>
                        <Button variant="success" className="flex-1" onClick={() => setSheetAberto(false)}>
                            Ver resultados
                        </Button>
                    </div>
                }
            >
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Período</p>
                <div className="space-y-1">
                    {(Object.keys(PERIODO_LABEL) as JogoPeriodo[]).map((p) => (
                        <OpcaoLista key={p} ativo={filtros.periodo === p}
                            label={PERIODO_LABEL[p]} onClick={() => onPeriodo(p)} />
                    ))}
                </div>

                <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-gray-500">Ordenar por</p>
                <div className="space-y-1">
                    {(Object.keys(SORT_LABEL) as JogoSort[]).map((s) => (
                        <OpcaoLista key={s} ativo={filtros.sort === s}
                            label={SORT_LABEL[s]} onClick={() => onSort(s)} />
                    ))}
                </div>

                {counts.pendentes > 0 && (
                    <div className="mt-6 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                        ⚠️ <b>{counts.pendentes}</b> jogo(s) já aconteceram e ainda estão sem resultado.
                        Use <b>Agendados</b> + <b>Já realizados</b> para encontrá-los.
                    </div>
                )}
            </BottomSheetModal>
        </>
    );
};