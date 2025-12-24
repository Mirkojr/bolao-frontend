import { useParams } from "react-router-dom";

// Componentes
import { AddParticipanteForm, AddJogoForm } from "./components/bolao-tool-bar"; 
import { BolaoMatrixTable } from "./components/bolao-matrix-table";
import { ParticipanteList } from "./components/participante-list";

// Hooks 
import { useParticipantes } from "./hooks/useParticipantes";
import { useJogos } from "./hooks/useJogos";
import { usePalpites } from "./hooks/usePalpites";

export const EditarBolaoPage = () => {
    const { id: bolaoId } = useParams(); 
    
    // Hooks de dados
    const { participantes, addParticipante, removeParticipante, loading: loadingPart } = useParticipantes(bolaoId);
    const { jogos, addJogo, loading: loadingJogos } = useJogos(bolaoId);
    const { palpites, savePalpite, loading: loadingPalpites } = usePalpites(bolaoId);

    // Tela de Carregamento Inicial (só mostra se não tiver dados ainda)
    if (!bolaoId) return <div>ID do bolão não encontrado.</div>;
    
    if (participantes.length === 0 && jogos.length === 0 && loadingPart) {
         return <div className="p-6 text-gray-500">Carregando dados do bolão...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Gerenciar Bolão #{bolaoId}</h1>

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

            {(loadingPart || loadingJogos || loadingPalpites) && (
                <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg animate-pulse">
                    Salvando alterações...
                </div>
            )}
            
            {/* --- LISTA DE PARTICIPANTES --- */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Lista de Usuários</h2>
                <ParticipanteList 
                    participantes={participantes}
                    onRemove={ (id) => removeParticipante(bolaoId!, id)}
                />
            </div>

        </div>
    );
};

export default EditarBolaoPage;