import { useState, useEffect } from "react";
import { BoloesTable } from "./components/boloes-table";
import { useBoloes } from "../../../shared/hooks/useBoloes"; 
import { AddBolaoForm } from "./components/add-bolao";
import { useAuth } from "@/context/AuthContext";

export const AdminBolaoPage = () => {
    const { boloes, loading, criarBolao, creating } = useBoloes();
    const { isAuthenticated } = useAuth();
    
    const [localBoloes, setLocalBoloes] = useState<any[]>([]);

    useEffect(() => {
        if (boloes) {
            setLocalBoloes(
                [...boloes].sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
            );
        }
    }, [boloes]);

    const handleBolaoDeleted = (id: number) => {
        setLocalBoloes(prev => prev.filter(bolao => bolao.id !== id));
    };

    if (!isAuthenticated) {
        return <div className="p-6 text-red-500">Acesso negado. Por favor, faça login como administrador.</div>;
    }
        
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gerenciar Bolões</h1>
            </div>

            <AddBolaoForm 
                onCriar={criarBolao}
                isCreating={creating}
            />

            {loading ? ( 
                <p className="text-gray-500">Carregando bolões...</p>
            ) : ( 
                <BoloesTable boloes={localBoloes} onBolaoDeleted={handleBolaoDeleted} />
            )}
            
            
        </div>
    );
}

export default AdminBolaoPage;