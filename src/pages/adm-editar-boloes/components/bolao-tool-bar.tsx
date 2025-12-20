import { useState } from "react";

// --- FORMULÁRIO DE PARTICIPANTE ---
export const AddParticipanteForm = ({ onAdd }: { onAdd: (nome: string) => void }) => {
    const [nome, setNome] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome.trim()) return;
        onAdd(nome);
        setNome("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-white p-3 rounded shadow-sm border border-gray-100">
            <input 
                type="text" 
                placeholder="Nome do Participante" 
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="border rounded px-3 py-1 text-sm outline-none focus:border-green-500"
            />
            <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 font-medium">
                + Pessoa
            </button>
        </form>
    );
};

// --- FORMULÁRIO DE JOGO ---
export const AddJogoForm = ({ onAdd }: { onAdd: (timeA: string, timeB: string) => void }) => {
    const [timeA, setTimeA] = useState("");
    const [timeB, setTimeB] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!timeA.trim() || !timeB.trim()) return;
        onAdd(timeA, timeB);
        setTimeA("");
        setTimeB("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-white p-3 rounded shadow-sm border border-gray-100">
            <input 
                type="text" placeholder="Time A" value={timeA} onChange={e => setTimeA(e.target.value)}
                className="w-24 border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
            />
            <span className="text-gray-400 text-xs font-bold">VS</span>
            <input 
                type="text" placeholder="Time B" value={timeB} onChange={e => setTimeB(e.target.value)}
                className="w-24 border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 font-medium">
                + Jogo
            </button>
        </form>
    );
};