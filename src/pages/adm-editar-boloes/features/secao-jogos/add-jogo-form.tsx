import { useState } from "react";

// --- FORMULÁRIO DE JOGO ---
interface AddJogoFormProps {
    onAdd: (timeA: string, timeB: string) => void;
}

export const AddJogoForm = ({ onAdd }: AddJogoFormProps) => {
    const [timeA, setTimeA] = useState("");
    const [timeB, setTimeB] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!timeA.trim() || !timeB.trim()) return;
        
        onAdd(timeA, timeB);
        setTimeA("");
        setTimeB("");
    };

    const isValid = timeA.trim() && timeB.trim();

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-white p-3 rounded shadow-sm border border-gray-100">
            <input 
                type="text" 
                placeholder="Time A" 
                value={timeA} 
                onChange={e => setTimeA(e.target.value)}
                className="w-24 md:w-32 border rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500 text-center"
            />
            <span className="text-gray-400 text-xs font-bold">VS</span>
            <input 
                type="text" 
                placeholder="Time B" 
                value={timeB} 
                onChange={e => setTimeB(e.target.value)}
                className="w-24 md:w-32 border rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500 text-center"
            />
            <button 
                type="submit" 
                disabled={!isValid}
                className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-2"
            >
                + Jogo
            </button>
        </form>
    );
};

