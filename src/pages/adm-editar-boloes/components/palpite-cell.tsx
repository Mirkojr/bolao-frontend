import { useState, useEffect, useRef } from "react";
import type { Palpite } from "@/shared/interfaces/palpite";

interface PalpiteCellProps {
  palpite: Palpite | undefined;
  onSave: (gol_a_palpite: number, gol_b_palpite: number) => Promise<void>;
}

export const PalpiteCell = ({ palpite, onSave }: PalpiteCellProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const firstInputRef = useRef<HTMLInputElement>(null);

    const [scoreA, setScoreA] = useState<string | number>(palpite?.gol_a_palpite ?? 0);
    const [scoreB, setScoreB] = useState<string | number>(palpite?.gol_b_palpite ?? 0);

    useEffect(() => {
        setScoreA(palpite?.gol_a_palpite ?? 0);
        setScoreB(palpite?.gol_b_palpite ?? 0);
    }, [palpite]);

    useEffect(() => {
        if (isEditing && firstInputRef.current) {
            firstInputRef.current.focus();
            firstInputRef.current.select(); 
        }
    }, [isEditing]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Converte para número antes de salvar
            const valA = scoreA === '' ? 0 : Number(scoreA);
            const valB = scoreB === '' ? 0 : Number(scoreB);
            
            await onSave(valA, valB);
            setIsEditing(false); 
        } catch (error) {
            alert("Erro ao salvar palpite!");
        } finally {
            setSaving(false);
        }
    };

    // MODO EDIÇÃO
    if (isEditing) {
        return (
            <div className="flex items-center justify-center gap-1 min-w-[100px]">
                <input
                    ref={firstInputRef}
                    type="number"
                    min="0"
                    value={scoreA}
                    onChange={(e) => setScoreA(e.target.value)}
                    className="w-10 text-center border rounded p-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none m-0"
                />
                <span className="text-gray-400 font-bold text-xs">x</span>
                <input
                    type="number"
                    min="0"
                    value={scoreB}
                    onChange={(e) => setScoreB(e.target.value)}
                    className="w-10 text-center border rounded p-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none m-0"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                    }}
                />
                
                {/* Botões de Ação */}
                <div className="flex flex-col gap-1 ml-1">
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="text-green-600 hover:text-green-800 text-xs disabled:opacity-50"
                        title="Salvar"
                    >
                        {saving ? '...' : '✔'}
                    </button>
                    <button 
                        onClick={() => {
                            setIsEditing(false);
                            setScoreA(palpite?.gol_a_palpite ?? 0);
                            setScoreB(palpite?.gol_b_palpite ?? 0);
                        }} 
                        className="text-red-500 hover:text-red-700 text-xs"
                        title="Cancelar"
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    }

    // MODO VISUALIZAÇÃO
    return (
        <div 
            onClick={() => {
                setScoreA(palpite?.gol_a_palpite ?? 0);
                setScoreB(palpite?.gol_b_palpite ?? 0);
                setIsEditing(true);
            }}
            className={`
                cursor-pointer py-2 px-1 rounded transition-all text-center border border-transparent
                hover:bg-blue-50 hover:border-blue-200 select-none
                ${!palpite ? 'text-gray-400 italic text-xs' : 'font-mono font-bold text-blue-700 bg-gray-50'}
            `}
        >
            {palpite ? (
                <span>{palpite.gol_a_palpite} - {palpite.gol_b_palpite}</span>
            ) : (
                <span className="opacity-50 text-[10px]">-- Palpitar --</span>
            )}
        </div>
    );
};