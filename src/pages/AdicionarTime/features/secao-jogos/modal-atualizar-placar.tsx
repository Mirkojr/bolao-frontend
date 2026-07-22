import { useState, useEffect } from 'react';
import type { Jogo } from '@/shared/interfaces/jogo';

interface ModalAtualizarPlacarProps {
    isOpen: boolean;
    onClose: () => void;
    jogo: Jogo | null;
    onSave: (jogoId: string, golA: number, golB: number) => void;
}

export const ModalAtualizarPlacar = ({ isOpen, onClose, jogo, onSave }: ModalAtualizarPlacarProps) => {
    const [golsA, setGolsA] = useState<number>(0);
    const [golsB, setGolsB] = useState<number>(0);

    useEffect(() => {
        if (jogo) {
            setGolsA(jogo.gol_a_real ?? 0);
            setGolsB(jogo.gol_b_real ?? 0);
        }
    }, [jogo]);

    if (!isOpen || !jogo) return null;

    const handleSave = () => {
        onSave(String(jogo.id), golsA, golsB);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                <h2 className="mb-1 text-center text-xl font-bold tracking-tight text-gray-900">
                    Atualizar placar
                </h2>
                <p className="mb-6 text-center text-sm text-gray-500">
                    Informe o resultado final da partida.
                </p>

                <div className="mb-6 flex items-center justify-center gap-3 text-center">
                    <span className="flex-1 truncate text-base font-semibold text-gray-800">
                        {jogo.timeA?.nome || 'Time A'}
                    </span>
                    <span className="text-xs font-bold text-gray-300">VS</span>
                    <span className="flex-1 truncate text-base font-semibold text-gray-800">
                        {jogo.timeB?.nome || 'Time B'}
                    </span>
                </div>

                <div className="mb-8 flex items-center justify-center gap-4">
                    <input
                        type="number"
                        min="0"
                        value={golsA}
                        onChange={(e) => setGolsA(parseInt(e.target.value) || 0)}
                        className="w-20 rounded-xl border-2 border-gray-200 p-3 text-center text-2xl font-bold outline-none transition focus:border-blue-500"
                    />
                    <span className="text-xl font-bold text-gray-300">X</span>
                    <input
                        type="number"
                        min="0"
                        value={golsB}
                        onChange={(e) => setGolsB(parseInt(e.target.value) || 0)}
                        className="w-20 rounded-xl border-2 border-gray-200 p-3 text-center text-2xl font-bold outline-none transition focus:border-blue-500"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Salvar placar
                    </button>
                </div>
            </div>
        </div>
    );
};