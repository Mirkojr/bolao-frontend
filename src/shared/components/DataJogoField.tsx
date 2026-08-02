import { useState } from "react";
import { DateTimePickerSheet } from "@/shared/components/DateTimePickerSheet";
import { rotuloDataHora } from "@/shared/utils/data-jogo";

type Props = {
    /** ISO ou "" */
    value: string;
    onChange: (iso: string) => void;
};

/** Campo compacto: mostra o resumo e abre o picker. Data é sempre opcional. */
export const DataJogoField = ({ value, onChange }: Props) => {
    const [aberto, setAberto] = useState(false);
    const temData = !!value;

    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-800">Data da partida</label>
                <span className="text-[11px] font-medium text-gray-400">opcional</span>
            </div>

            <button
                type="button"
                onClick={() => setAberto(true)}
                className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition active:scale-[0.99]
                    ${temData ? "border-indigo-200 bg-white" : "border-dashed border-gray-300 bg-gray-50"}`}
            >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base
                    ${temData ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                    📅
                </span>
                <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm font-semibold ${temData ? "text-gray-800" : "text-gray-500"}`}>
                        {temData ? rotuloDataHora(value) : "Definir data e hora"}
                    </span>
                    <span className="block text-[11px] text-gray-400">
                        {temData ? "Toque para alterar" : "Deixe vazio para “a definir”"}
                    </span>
                </span>
                {temData && (
                    <span
                        role="button"
                        aria-label="Remover data"
                        onClick={(e) => { e.stopPropagation(); onChange(""); }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                        ✕
                    </span>
                )}
            </button>

            <DateTimePickerSheet
                isOpen={aberto}
                onClose={() => setAberto(false)}
                value={value}
                onConfirm={onChange}
            />
        </div>
    );
};