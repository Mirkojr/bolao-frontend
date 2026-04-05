import { useState, useEffect } from "react";
import type { Jogo } from "@/shared/interfaces/jogo";

interface ModalAtualizarPlacarProps {
    isOpen: boolean;
    onClose: () => void;
    jogo: Jogo | null;
    onSave: (jogoId: string, golA: number, golB: number) => void;
}

export const ModalAtualizarPlacar = ({ isOpen, onClose, jogo, onSave }: ModalAtualizarPlacarProps) => {
    const [golsA, setGolsA] = useState<number>(0);
    const [golsB, setGolsB] = useState<number>(0);

    // Quando o modal abrir ou o jogo mudar, preenchemos com os gols atuais
    useEffect(() => {
        if (jogo) {
            setGolsA(jogo.gol_a_real ?? 0);
            setGolsB(jogo.gol_b_real ?? 0);
        }
    }, [jogo]);

    if (!isOpen || !jogo) return null;

    const handleSave = () => {
        onSave(String(jogo.id), golsA, golsB);
        onClose(); // Fecha o modal após salvar
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Atualizar Placar</h2>
                
                <div className="text-center mb-6 text-gray-700 text-lg">
                    <span className="font-bold">{jogo.timeA?.nome || 'Time A'}</span>
                    <span className="mx-3 text-gray-400">vs</span>
                    <span className="font-bold">{jogo.timeB?.nome || 'Time B'}</span>
                </div>
                
                <div className="flex justify-center items-center gap-4 mb-8">
                    <input
                        type="number"
                        min="0"
                        value={golsA}
                        onChange={(e) => setGolsA(parseInt(e.target.value) || 0)}
                        className="w-20 p-3 border-2 border-gray-200 rounded-lg text-center text-2xl font-bold focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-xl font-bold text-gray-400">X</span>
                    <input
                        type="number"
                        min="0"
                        value={golsB}
                        onChange={(e) => setGolsB(parseInt(e.target.value) || 0)}
                        className="w-20 p-3 border-2 border-gray-200 rounded-lg text-center text-2xl font-bold focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Salvar Placar
                    </button>
                </div>
            </div>
        </div>
    );
};