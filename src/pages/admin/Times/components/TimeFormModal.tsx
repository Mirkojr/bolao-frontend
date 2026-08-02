import { useEffect, useState } from "react";
import type { Time } from "@/shared/interfaces/time";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

interface TimeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dados: Partial<Time>) => Promise<void>;
    timeEditando?: Time | null;
}

export const TimeFormModal = ({ isOpen, onClose, onSubmit, timeEditando }: TimeFormModalProps) => {
    const [nome, setNome] = useState("");
    const [sigla, setSigla] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const editando = !!timeEditando;

    useEffect(() => {
        if (isOpen) {
            setNome(timeEditando?.nome ?? "");
            setSigla(timeEditando?.sigla ?? "");
            setErro("");
        }
    }, [isOpen, timeEditando]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        if (!nome.trim()) return setErro("Informe o nome do time.");
        if (sigla && (sigla.trim().length < 2 || sigla.trim().length > 3)) {
            return setErro("A sigla deve ter 2 ou 3 letras (ou deixe em branco p/ gerar automático).");
        }

        setSalvando(true);
        try {
            await onSubmit({
                nome: nome.trim(),
                sigla: sigla.trim() ? sigla.trim().toUpperCase() : undefined,
            });
            onClose();
        } catch (err: any) {
            setErro(err?.message || "Erro ao salvar time.");
        } finally {
            setSalvando(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-gray-100 p-5">
                    <h2 className="text-lg font-semibold text-gray-800">{editando ? "Editar time" : "Novo time"}</h2>
                    <button onClick={onClose} aria-label="Fechar"
                        className="text-gray-400 hover:text-red-500 transition-colors text-xl leading-none">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <Input fullWidth label="Nome do time" placeholder="Ex: Flamengo" autoFocus
                        value={nome} onChange={(e) => setNome(e.target.value)} />
                    <div>
                        <Input fullWidth label="Sigla (opcional)" placeholder="Gerada automaticamente"
                            maxLength={3} value={sigla}
                            onChange={(e) => setSigla(e.target.value.toUpperCase())} />
                        <p className="mt-1 text-xs text-gray-400">
                            Em branco = criamos a sigla pelo nome (ex: Flamengo → FLA).
                        </p>
                    </div>

                    {erro && <p className="text-sm text-red-600">{erro}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="success" disabled={salvando}>
                            {salvando ? "Salvando..." : editando ? "Salvar" : "Criar time"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};