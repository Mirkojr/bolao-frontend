import { useEffect, useMemo, useRef, useState } from "react";
import type { Time } from "@/shared/interfaces/time";
import { BottomSheetModal } from "@/shared/components/BottomSheetModal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    times: Time[];
    valueId?: string | null;
    onSelect: (timeId: string) => void;
    /** Ex: "Escolher mandante" */
    title?: string;
    /** ids que não devem aparecer (o time já escolhido do outro lado) */
    excludeIds?: string[];
};

export const TimePickerSheet = ({
    isOpen, onClose, times, valueId, onSelect, title = "Escolher time", excludeIds = [],
}: Props) => {
    const [busca, setBusca] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        setBusca("");
        // autofoco só no desktop — no mobile evita o teclado tampar a lista
        const ehDesktop = window.matchMedia?.("(pointer: fine)").matches;
        if (ehDesktop) setTimeout(() => inputRef.current?.focus(), 80);
    }, [isOpen]);

    const lista = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return times
            .filter((t) => !excludeIds.map(String).includes(String(t.id)))
            .filter((t) => (termo ? `${t.nome} ${t.sigla ?? ""}`.toLowerCase().includes(termo) : true))
            .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    }, [times, busca, excludeIds]);

    const escolher = (id: string) => { onSelect(id); onClose(); };

    return (
        <BottomSheetModal isOpen={isOpen} onClose={onClose} title={title} layer={2} tall flushBody>
            {/* Busca fixa no topo */}
            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-3">
                <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        ref={inputRef}
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar time por nome ou sigla..."
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                    {busca && (
                        <button
                            type="button"
                            aria-label="Limpar busca"
                            onClick={() => { setBusca(""); inputRef.current?.focus(); }}
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <p className="mt-2 text-xs text-gray-400">
                    {lista.length} time(s) {busca ? "encontrado(s)" : "cadastrado(s)"}
                </p>
            </div>

            {/* Lista */}
            {lista.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
                    <p className="text-sm text-gray-500">Nenhum time encontrado.</p>
                    <p className="mt-1 text-xs text-gray-400">
                        Cadastre novos times na página <span className="font-medium">Times</span>.
                    </p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-100 pb-[env(safe-area-inset-bottom)]">
                    {lista.map((t) => {
                        const ativo = String(t.id) === String(valueId);
                        return (
                            <li key={t.id}>
                                <button
                                    type="button"
                                    onClick={() => escolher(String(t.id))}
                                    className={`flex h-14 w-full items-center gap-3 px-4 text-left transition active:bg-indigo-100
                                        ${ativo ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                                >
                                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold
                                        ${ativo ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                                        {(t.sigla ?? t.nome.substring(0, 3)).toUpperCase()}
                                    </span>
                                    <span className={`min-w-0 flex-1 truncate text-sm ${ativo ? "font-semibold text-indigo-700" : "text-gray-800"}`}>
                                        {t.nome}
                                    </span>
                                    {ativo && <span className="shrink-0 text-indigo-600">✓</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </BottomSheetModal>
    );
};