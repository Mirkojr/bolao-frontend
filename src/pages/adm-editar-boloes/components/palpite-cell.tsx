import { useState } from "react";
import type { Palpite } from "../../../shared/interfaces/palpite";

interface PalpiteCellProps {
  palpite: Palpite | undefined;
  onSave: (placarA: number, placarB: number) => Promise<void>;
}

export const PalpiteCell = ({ palpite, onSave }: PalpiteCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estados locais para os inputs
  const [scoreA, setScoreA] = useState(palpite?.placarA ?? 0);
  const [scoreB, setScoreB] = useState(palpite?.placarB ?? 0);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(scoreA, scoreB);
      setIsEditing(false); // Sai do modo edição
    } catch (error) {
      alert("Erro ao salvar!");
    } finally {
      setSaving(false);
    }
  };

  // Se estiver editando, mostra os inputs
  if (isEditing) {
    return (
      <div className="flex items-center justify-center gap-1">
        <input
          type="number"
          value={scoreA}
          onChange={(e) => setScoreA(Number(e.target.value))}
          className="w-10 text-center border rounded p-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-400 font-bold">x</span>
        <input
          type="number"
          value={scoreB}
          onChange={(e) => setScoreB(Number(e.target.value))}
          className="w-10 text-center border rounded p-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
            onClick={handleSave} 
            disabled={saving}
            className="ml-1 text-green-600 hover:text-green-800"
        >
          {saving ? '...' : '✔'}
        </button>
        <button 
            onClick={() => setIsEditing(false)} 
            className="text-red-500 hover:text-red-700 ml-1"
        >
            ✕
        </button>
      </div>
    );
  }

  // MODO VISUALIZAÇÃO (o bonitinho)
  return (
    <div 
      onClick={() => {
        setScoreA(palpite?.placarA ?? 0);
        setScoreB(palpite?.placarB ?? 0);
        setIsEditing(true);
      }}
      className={`
        cursor-pointer py-2 px-3 rounded transition-all text-center border border-transparent
        hover:bg-blue-50 hover:border-blue-200
        ${!palpite ? 'text-gray-400 italic text-xs' : 'font-mono font-bold text-blue-700 bg-gray-50'}
      `}
    >
      {palpite ? (
        <span>{palpite.placarA} - {palpite.placarB}</span>
      ) : (
        <span>-- Palpitar --</span>
      )}
    </div>
  );
};