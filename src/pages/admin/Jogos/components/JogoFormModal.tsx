import { useEffect, useState } from "react";
import type { Jogo } from "@/shared/interfaces/jogo";
import type { Time } from "@/shared/interfaces/time";
import { TimeSelect } from "@/shared/components/TimeSelect";
import { BottomSheetModal } from "@/shared/components/BottomSheetModal";
import { DataJogoField } from "@/shared/components/DataJogoField";
import { Button } from "@/shared/components/Button";

export type JogoFormData = {
    time_a_id: number;
    time_b_id: number;
    data_jogo: string;
    gol_a_real?: number | null;
    gol_b_real?: number | null;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    times: Time[];
    jogoEditando?: Jogo | null;
    onSubmit: (dados: JogoFormData) => Promise<void>;
};

export const JogoFormModal = ({ isOpen, onClose, times, jogoEditando, onSubmit }: Props) => {
    const [timeA, setTimeA] = useState<string | null>(null);
    const [timeB, setTimeB] = useState<string | null>(null);
    const [dataJogo, setDataJogo] = useState("");     // ISO ou ""
    const [comResultado, setComResultado] = useState(false);
    const [golA, setGolA] = useState(0);
    const [golB, setGolB] = useState(0);
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const temPlacar =
            jogoEditando?.gol_a_real !== null && jogoEditando?.gol_a_real !== undefined;
        setTimeA(jogoEditando ? String(jogoEditando.time_a_id) : null);
        setTimeB(jogoEditando ? String(jogoEditando.time_b_id) : null);
        setDataJogo(jogoEditando?.data_jogo ?? "");
        setComResultado(!!temPlacar);
        setGolA(temPlacar ? Number(jogoEditando?.gol_a_real) : 0);
        setGolB(temPlacar ? Number(jogoEditando?.gol_b_real) : 0);
        setErro("");
    }, [isOpen, jogoEditando]);

    const handleSalvar = async () => {
        if (!timeA || !timeB) return setErro("Selecione os dois times.");
        if (String(timeA) === String(timeB)) return setErro("Os times precisam ser diferentes.");

        setSalvando(true);
        setErro("");
        try {
            await onSubmit({
                time_a_id: Number(timeA),
                time_b_id: Number(timeB),
                data_jogo: dataJogo, // "" = a definir
                gol_a_real: comResultado ? golA : null,
                gol_b_real: comResultado ? golB : null,
            });
            onClose();
        } catch (e) {
            setErro(e instanceof Error ? e.message : "Erro ao salvar o jogo.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <BottomSheetModal
            isOpen={isOpen}
            onClose={onClose}
            title={jogoEditando ? "Editar Jogo" : "Criar Novo Jogo"}
            footer={
                <div className="flex flex-col gap-2">
                    <Button variant="success" disabled={salvando} onClick={handleSalvar}>
                        {salvando ? "Salvando..." : "Salvar Jogo"}
                    </Button>
                    <Button variant="ghost" onClick={onClose}
                        className="border border-red-300 text-red-500">
                        Cancelar
                    </Button>
                </div>
            }
        >
            {/* 1. Times lado a lado (o mais importante primeiro) */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3">
                <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                        <TimeSelect label="Mandante" times={times} value={timeA}
                            onChange={setTimeA} excludeIds={timeB ? [timeB] : []} />
                    </div>
                    <span className="mt-5 shrink-0 text-sm font-bold text-gray-400">X</span>
                    <div className="min-w-0 flex-1">
                        <TimeSelect label="Visitante" times={times} value={timeB}
                            onChange={setTimeB} excludeIds={timeA ? [timeA] : []} />
                    </div>
                </div>
                {(!timeA || !timeB) && (
                    <p className="mt-2 text-center text-[11px] text-gray-400">
                        Toque em cada card para escolher o time
                    </p>
                )}
            </div>

            {/* 2. Data (opcional) */}
            <div className="mt-5">
                <DataJogoField value={dataJogo} onChange={setDataJogo} />
            </div>

            {/* 3. Resultado (opcional) */}
            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-medium text-gray-700">
                    {jogoEditando ? "Jogo já tem resultado?" : "Já adicionar resultado final?"}
                </span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={comResultado}
                    onClick={() => setComResultado((v) => !v)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        comResultado ? "bg-green-500" : "bg-gray-300"
                    }`}
                >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        comResultado ? "left-[22px]" : "left-0.5"
                    }`} />
                </button>
            </div>

            {comResultado && (
                <div className="mt-3 flex items-center justify-center gap-3 rounded-xl bg-gray-50 p-3">
                    <input type="number" min={0} inputMode="numeric" value={golA}
                        onChange={(e) => setGolA(Math.max(0, Number(e.target.value)))}
                        className="h-12 w-16 rounded-lg border border-gray-300 text-center text-lg font-bold outline-none focus:border-indigo-500" />
                    <span className="text-sm font-bold text-gray-400">X</span>
                    <input type="number" min={0} inputMode="numeric" value={golB}
                        onChange={(e) => setGolB(Math.max(0, Number(e.target.value)))}
                        className="h-12 w-16 rounded-lg border border-gray-300 text-center text-lg font-bold outline-none focus:border-indigo-500" />
                </div>
            )}

            {erro && <p className="mt-3 text-center text-sm text-red-500">{erro}</p>}
        </BottomSheetModal>
    );
};