import { useState } from "react";
import { Button } from "../../../adm-editar-boloes/components/Button";
import { Input } from "../../../adm-editar-boloes/components/Input";

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
            <Input
                type="text" 
                placeholder="Time A" 
                value={timeA} 
                onChange={e => setTimeA(e.target.value)}
                className="w-24 md:w-32 text-center"
                inputSize="sm"
            />
            <span className="text-gray-400 text-xs font-bold">VS</span>
            <Input
                type="text" 
                placeholder="Time B" 
                value={timeB} 
                onChange={e => setTimeB(e.target.value)}
                className="w-24 md:w-32 text-center"
                inputSize="sm"
            />
            <Button
                type="submit" 
                disabled={!isValid}
                variant="primary"
                size="sm"
                className="ml-2"
            >
                + Jogo
            </Button>
        </form>
    );
};

