import { useState, useEffect, useRef } from "react";
import type { Palpite } from "@/shared/interfaces/palpite";
import { ScoreInput } from "../../components/ScoreInput";

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

    const handleCancel = () => {
        setIsEditing(false);
        setScoreA(palpite?.gol_a_palpite ?? 0);
        setScoreB(palpite?.gol_b_palpite ?? 0);
    };

    // MODO EDIÇÃO
    if (isEditing) {
        return (
            <div className="flex items-center justify-center min-w-25">
                <ScoreInput
                    ref={firstInputRef}
                    scoreA={scoreA}
                    scoreB={scoreB}
                    onScoreAChange={setScoreA}
                    onScoreBChange={setScoreB}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    showActions={true}
                    saving={saving}
                    size="md"
                    autoFocus={true}
                />
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