import { useParams } from "react-router-dom";

// Hooks
import { useBolaoEdicao } from "./hooks/useBolaoEdicao";
import { useBolaoActions } from "./hooks/useBolaoActions";

// Componentes
import { AddParticipanteForm, AddJogoForm } from "./components/bolao-tool-bar"; 
import { BolaoMatrixTable } from "./components/bolao-matrix-table";

export const EditarBolaoPage = () => {
    const { id } = useParams();
    
    const { jogos, participantes, palpites, loading, refresh } = useBolaoEdicao(id);

    const { addParticipante, addJogo, savePalpite } = useBolaoActions(id, refresh);

    if (loading) return <div className="p-6 text-gray-500">Carregando dados do bolão...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Gerenciar Bolão #{id}</h1>

            {/* --- TOOLBAR --- */}
            <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-100 rounded-lg border border-gray-200 items-center">
                <AddParticipanteForm onAdd={addParticipante} />
                <div className="w-px h-8 bg-gray-300 mx-2 hidden md:block"></div>
                <AddJogoForm onAdd={addJogo} />
            </div>

            {/* --- TABELA DE PALPITES --- */}
            <BolaoMatrixTable 
                jogos={jogos}
                participantes={participantes}
                palpites={palpites}
                onSavePalpite={savePalpite}
            />
        </div>
    );
};

export default EditarBolaoPage;