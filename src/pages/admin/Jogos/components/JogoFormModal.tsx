import { useEffect, useState } from "react";
import type { Jogo } from "@/shared/interfaces/jogo";
import type { Time } from "@/shared/interfaces/time";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { TimeSelect } from "@/shared/components/TimeSelect";

interface JogoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    times: Time[];
    jogoEditando?: Jogo | null;
    onSubmit: (dados: { time_a_id: number; time_b_id: number; data_jogo: string }) => Promise<void>;
}

// ISO -> valor do input datetime-local (yyyy-MM-ddTHH:mm) no fuso local
const isoParaInputLocal = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const JogoFormModal = ({ isOpen, onClose, times, jogoEditando, onSubmit }: JogoFormModalProps) => {
    const [timeAId, setTimeAId] = useState("");
    const [timeBId, setTimeBId] = useState("");
    const [dataJogo, setDataJogo] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const editando = !!jogoEditando;

    useEffect(() => {
        if (isOpen) {
            setTimeAId(jogoEditando ? String(jogoEditando.time_a_id) : "");
            setTimeBId(jogoEditando ? String(jogoEditando.time_b_id) : "");
            setDataJogo(isoParaInputLocal(jogoEditando?.data_jogo));
            setErro("");
        }
    }, [isOpen, jogoEditando]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        if (!timeAId || !timeBId) return setErro("Selecione os dois times.");
        if (timeAId === timeBId) return setErro("Os dois times não podem ser iguais.");
        if (!dataJogo) return setErro("Informe a data e hora.");

        setSalvando(true);
        try {
            await onSubmit({
                time_a_id: Number(timeAId),
                time_b_id: Number(timeBId),
                data_jogo: new Date(dataJogo).toISOString(),
            });
            onClose();
        } catch (err: any) {
            setErro(err?.message || "Erro ao salvar jogo.");
        } finally {
            setSalvando(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-gray-100 p-5">
                    <h2 className="text-lg font-semibold text-gray-800">{editando ? "Editar jogo" : "Novo jogo"}</h2>
                    <button onClick={onClose} aria-label="Fechar"
                        className="text-gray-400 hover:text-red-500 transition-colors text-xl leading-none">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <TimeSelect label="Time A" times={times} value={timeAId} onChange={setTimeAId} excludeId={timeBId} />
                    <div className="text-center text-sm font-semibold text-gray-400">VS</div>
                    <TimeSelect label="Time B" times={times} value={timeBId} onChange={setTimeBId} excludeId={timeAId} />
                    <Input fullWidth type="datetime-local" label="Data e hora"
                        value={dataJogo} onChange={(e) => setDataJogo(e.target.value)} />

                    {times.length === 0 && (
                        <p className="text-sm text-amber-600">
                            Nenhum time cadastrado ainda. Cadastre na página de Times primeiro.
                        </p>
                    )}
                    {erro && <p className="text-sm text-red-600">{erro}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="success" disabled={salvando}>
                            {salvando ? "Salvando..." : editando ? "Salvar" : "Criar jogo"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};