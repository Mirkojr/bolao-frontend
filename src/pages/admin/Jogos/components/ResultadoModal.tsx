import { useEffect, useState } from "react";
import type { Jogo } from "@/shared/interfaces/jogo";
import { BottomSheetModal } from "@/shared/components/BottomSheetModal";
import { Button } from "@/shared/components/Button";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    jogo: Jogo | null;
    onSalvar: (jogoId: string, golA: number | null, golB: number | null) => Promise<void>;
};

/** Stepper grande, feito pro dedo: − [n] + */
const Stepper = ({
    nome, valor, onChange,
}: { nome: string; valor: number; onChange: (n: number) => void }) => (
    <div className="flex flex-1 flex-col items-center gap-2">
        <span className="line-clamp-2 h-10 text-center text-sm font-semibold text-gray-700">
            {nome}
        </span>
        <input
            type="number"
            min={0}
            inputMode="numeric"
            value={valor}
            onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
            className="h-16 w-full rounded-xl border-2 border-gray-200 bg-gray-50 text-center text-3xl font-bold text-gray-900 outline-none focus:border-indigo-500 focus:bg-white"
        />
        <div className="flex w-full gap-2">
            <button type="button" aria-label={`Menos um gol para ${nome}`}
                onClick={() => onChange(Math.max(0, valor - 1))}
                className="h-11 flex-1 rounded-lg bg-gray-100 text-xl font-bold text-gray-600 active:scale-95">
                −
            </button>
            <button type="button" aria-label={`Mais um gol para ${nome}`}
                onClick={() => onChange(valor + 1)}
                className="h-11 flex-1 rounded-lg bg-indigo-600 text-xl font-bold text-white active:scale-95">
                +
            </button>
        </div>
    </div>
);

export const ResultadoModal = ({ isOpen, onClose, jogo, onSalvar }: Props) => {
    const [golA, setGolA] = useState(0);
    const [golB, setGolB] = useState(0);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const jaTemResultado = jogo?.gol_a_real !== null && jogo?.gol_a_real !== undefined;

    useEffect(() => {
        if (!isOpen || !jogo) return;
        setGolA(jaTemResultado ? Number(jogo.gol_a_real) : 0);
        setGolB(jaTemResultado ? Number(jogo.gol_b_real) : 0);
        setErro("");
    }, [isOpen, jogo, jaTemResultado]);

    if (!jogo) return null;

    const salvar = async (a: number | null, b: number | null) => {
        setSalvando(true);
        setErro("");
        try {
            await onSalvar(String(jogo.id), a, b);
            onClose();
        } catch (e) {
            setErro(e instanceof Error ? e.message : "Não foi possível salvar o resultado.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <BottomSheetModal
            isOpen={isOpen}
            onClose={onClose}
            title={jaTemResultado ? "Editar Resultado" : "Lançar Resultado"}
            footer={
                <div className="flex flex-col gap-2">
                    <Button variant="success" disabled={salvando}
                        onClick={() => salvar(golA, golB)}>
                        {salvando ? "Salvando..." : "Salvar resultado"}
                    </Button>
                    {jaTemResultado && (
                        <Button variant="ghost"  disabled={salvando}
                            className="text-red-500 w-full"
                            onClick={() => salvar(null, null)}>
                            Remover resultado
                        </Button>
                    )}
                </div>
            }
        >
            {/* Placar lado a lado */}
            <div className="flex items-start gap-3">
                <Stepper nome={jogo.timeA?.nome ?? "Time A"} valor={golA} onChange={setGolA} />
                <span className="pt-14 text-lg font-bold text-gray-300">X</span>
                <Stepper nome={jogo.timeB?.nome ?? "Time B"} valor={golB} onChange={setGolB} />
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
                Ao salvar, a pontuação dos palpites deste jogo é recalculada automaticamente.
            </p>

            {erro && <p className="mt-3 text-center text-sm text-red-500">{erro}</p>}
        </BottomSheetModal>
    );
};