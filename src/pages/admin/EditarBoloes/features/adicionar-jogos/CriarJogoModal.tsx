import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

interface CriarJogoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCriar: (timeA: string, timeB: string, dataJogo: string) => Promise<void>;
}

export const CriarJogoModal = ({ isOpen, onClose, onCriar }: CriarJogoModalProps) => {
    const [timeA, setTimeA] = useState("");
    const [timeB, setTimeB] = useState("");
    const [dataJogo, setDataJogo] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const resetar = () => {
        setTimeA("");
        setTimeB("");
        setDataJogo("");
        setErro("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");

        if (!timeA.trim() || !timeB.trim()) return setErro("Informe os dois times.");
        if (!dataJogo) return setErro("Informe a data e hora do jogo.");
        if (timeA.trim().toLowerCase() === timeB.trim().toLowerCase()) {
            return setErro("Os dois times não podem ser iguais.");
        }

        setSalvando(true);
        try {
            // datetime-local -> ISO 8601 (o backend guarda em UTC)
            await onCriar(timeA.trim(), timeB.trim(), new Date(dataJogo).toISOString());
            resetar();
            onClose();
        } catch (err: any) {
            setErro(err?.message || "Erro ao criar jogo.");
        } finally {
            setSalvando(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-gray-100 p-5">
                    <h2 className="text-lg font-semibold text-gray-800">Criar novo jogo</h2>
                    <button onClick={onClose} aria-label="Fechar"
                        className="text-gray-400 hover:text-red-500 transition-colors text-xl leading-none">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <Input fullWidth label="Time A" placeholder="Ex: Flamengo"
                        value={timeA} onChange={(e) => setTimeA(e.target.value)} />
                    <Input fullWidth label="Time B" placeholder="Ex: Vasco"
                        value={timeB} onChange={(e) => setTimeB(e.target.value)} />
                    <Input fullWidth type="datetime-local" label="Data e hora"
                        value={dataJogo} onChange={(e) => setDataJogo(e.target.value)} />

                    {erro && <p className="text-sm text-red-600">{erro}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="success" disabled={salvando}>
                            {salvando ? "Criando..." : "Criar jogo"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};