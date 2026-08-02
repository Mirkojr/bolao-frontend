import { BoloesTable } from "./components/boloes-table";
import { useBoloes } from "../../../shared/hooks/useBoloes";
import { AddBolaoForm } from "./components/add-bolao";
import { Pagination } from "@/shared/components/Pagination";
import { useAuth } from "@/context/AuthContext";

export const AdminBolaoPage = () => {
    const {
        boloes, loading, criarBolao, creating, refetch,
        page, setPage, totalPages,
    } = useBoloes();
    const { isAuthenticated } = useAuth();

    // A tabela chama o service de delete internamente; aqui só recarregamos a página.
    const handleBolaoDeleted = () => {
        refetch(true);
    };

    if (!isAuthenticated) {
        return <div className="p-6 text-red-500">Acesso negado. Por favor, faça login como administrador.</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gerenciar Bolões</h1>
            </div>

            <AddBolaoForm onCriar={criarBolao} isCreating={creating} />

            {loading ? (
                <p className="text-gray-500">Carregando bolões...</p>
            ) : (
                <>
                    <BoloesTable boloes={boloes} onBolaoDeleted={handleBolaoDeleted} />
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}
        </div>
    );
};

export default AdminBolaoPage;