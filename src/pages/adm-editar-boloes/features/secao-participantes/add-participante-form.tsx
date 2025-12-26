import React, { useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

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
            <Input
                type="text" 
                placeholder="Nome do participante..." 
                value={nome}
                onChange={e => setNome(e.target.value)}
                variant="default"
                inputSize="sm"
                className="w-full md:w-64"
            />
            <Button
                type="submit" 
                disabled={!nome.trim()}
                variant="success"
                size="sm"
            >
                + Pessoa
            </Button>
        </form>
    );
};
