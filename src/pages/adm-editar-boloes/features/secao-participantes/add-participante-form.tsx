import React, { useState } from "react";

// --- FORMULÁRIO DE PARTICIPANTE ---
interface AddParticipanteFormProps {
    onAdd: (nome: string) => void;
}

export const AddParticipanteForm = ({ onAdd }: AddParticipanteFormProps) => {
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
                placeholder="Nome do participante..." 
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm outline-none focus:border-green-500 w-full md:w-64"
            />
            <button 
                type="submit" 
                disabled={!nome.trim()}
                className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                + Pessoa
            </button>
        </form>
    );
};
