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
        return <div className="p-6 text-red-500">Acesso negado. Por favor, faça login para acessar seus bolões.</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Meus Bolões</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Crie e administre seus bolões usando os jogos disponíveis no sistema.
                    </p>
                </div>
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