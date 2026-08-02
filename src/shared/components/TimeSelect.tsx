import { useEffect, useRef, useState } from "react";
import type { Time } from "@/shared/interfaces/time";

interface TimeSelectProps {
    label?: string;
    times: Time[];
    value: string;                 // id do time selecionado ("" = nenhum)
    onChange: (id: string) => void;
    placeholder?: string;
    excludeId?: string;            // esconde este id (ex: time já escolhido no outro campo)
}

export const TimeSelect = ({
    label, times, value, onChange, placeholder = "Selecionar time...", excludeId,
}: TimeSelectProps) => {
    const [open, setOpen] = useState(false);
    const [busca, setBusca] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const selecionado = times.find((t) => String(t.id) === String(value));
    const filtrados = times
        .filter((t) => String(t.id) !== String(excludeId))
        .filter((t) => t.nome.toLowerCase().includes(busca.toLowerCase()));

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setBusca("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="w-full" ref={ref}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className="relative">
                <button type="button" onClick={() => setOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-left text-sm outline-none transition focus:border-blue-500">
                    <span className={selecionado ? "text-gray-800" : "text-gray-400"}>
                        {selecionado ? `${selecionado.nome} (${selecionado.sigla})` : placeholder}
                    </span>
                    <span className="text-gray-400">▾</span>
                </button>

                {open && (
                    <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                        <div className="p-2">
                            <input autoFocus value={busca} onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-500" />
                        </div>
                        <ul className="max-h-52 overflow-y-auto pb-2">
                            {filtrados.length === 0 ? (
                                <li className="px-3 py-2 text-sm text-gray-400">Nenhum time encontrado</li>
                            ) : (
                                filtrados.map((t) => (
                                    <li key={t.id}>
                                        <button type="button"
                                            onClick={() => { onChange(String(t.id)); setOpen(false); setBusca(""); }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-blue-50">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                                                {t.sigla}
                                            </span>
                                            <span className="truncate text-gray-800">{t.nome}</span>
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};