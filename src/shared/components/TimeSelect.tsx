import { useMemo, useState } from "react";
import type { Time } from "@/shared/interfaces/time";
import { TimePickerSheet } from "@/shared/components/TimePickerSheet";

type Props = {
    times: Time[];
    value: string | null;
    onChange: (timeId: string) => void;
    label?: string;
    placeholder?: string;
    excludeIds?: string[];
    disabled?: boolean;
};

export const TimeSelect = ({
    times, value, onChange, label, placeholder = "Selecionar", excludeIds = [], disabled,
}: Props) => {
    const [pickerAberto, setPickerAberto] = useState(false);

    const selecionado = useMemo(
        () => times.find((t) => String(t.id) === String(value)) ?? null,
        [times, value]
    );

    return (
        <div className="w-full min-w-0">
            {label && (
                <span className="mb-1.5 block text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {label}
                </span>
            )}

            <button
                type="button"
                disabled={disabled}
                onClick={() => setPickerAberto(true)}
                className={`flex min-h-72px w-full min-w-0 flex-col items-center justify-center gap-1 rounded-xl border-2 bg-white px-2 py-3 transition
                    ${selecionado ? "border-indigo-200" : "border-dashed border-gray-300"}
                    ${disabled ? "cursor-not-allowed opacity-60" : "active:scale-[0.98] hover:border-indigo-400"}`}
            >
                {selecionado ? (
                    <>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                            {(selecionado.sigla ?? selecionado.nome.substring(0, 3)).toUpperCase()}
                        </span>
                        <span className="line-clamp-2 w-full break-words text-center text-sm font-semibold leading-tight text-gray-800">
                            {selecionado.nome}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-base text-gray-400">
                            +
                        </span>
                        <span className="text-xs font-medium text-gray-400">{placeholder}</span>
                    </>
                )}
            </button>

            <TimePickerSheet
                isOpen={pickerAberto}
                onClose={() => setPickerAberto(false)}
                times={times}
                valueId={value}
                onSelect={onChange}
                title={label ? `Escolher ${label.toLowerCase()}` : "Escolher time"}
                excludeIds={excludeIds}
            />
        </div>
    );
};