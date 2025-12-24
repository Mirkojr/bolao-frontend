import { BoloesTable } from "./components/boloes-table";
import { useBoloes } from "./hooks/useBoloes"; 
import NavBar from '@/shared/components/nav-bar/nav-bar'
import { AddBolaoForm } from "./components/add-bolao";
import { useAuth } from "@/context/AuthContext";

export const AdminBolaoPage = () => {
    const { boloes, loading, criarBolao, creating } = useBoloes();

    const { isAuthenticated } = useAuth();
        if (!isAuthenticated) {
            return <div className="p-6 text-red-500">Acesso negado. Por favor, faça login como administrador.</div>;
        }
        
    return (
        <>
            <NavBar />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Gerenciar Bolões </h1>
                </div>

                {loading ? ( <p className="text-gray-500">Carregando bolões...</p>) : 
                        ( <BoloesTable boloes={boloes} />)}
                
                <AddBolaoForm 
                    onCriar={criarBolao}
                    isCreating={creating}
                />

            </div>
        </>
    );
}

export default AdminBolaoPage;