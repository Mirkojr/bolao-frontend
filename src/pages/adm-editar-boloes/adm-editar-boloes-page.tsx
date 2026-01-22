import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Hooks
import { useParticipantes } from "./hooks/useParticipantes";
import { useJogos } from "@/shared/hooks/useJogos";
import { usePalpites } from "./hooks/usePalpites";

// Componentes 
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Section } from "./components/Section";

// Features 
import { BolaoMatrixTable } from "./features/tabela-palpites/tabela-palpites";
import { ParticipantesSection } from "./features/secao-participantes/secao-participantes"; 

export const EditarBolaoPage = () => {
    const { id: bolaoId } = useParams(); 
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    
    // Hooks de Dados
    const { participantes, addParticipante, removeParticipante, loading: loadingPart } = useParticipantes(bolaoId);
    const { jogos, addJogo, loading: loadingJogos } = useJogos(bolaoId);
    const { palpites, savePalpite, loading: loadingPalpites } = usePalpites(bolaoId);
    
    const bolaoState = location.state?.bolaoData;
    const nomeBolao = bolaoState?.nome || " Bolão ";

    // Validações Iniciais
    if (!isAuthenticated) {
        return <div className="p-6 text-red-500">Acesso negado. Por favor, faça login como administrador.</div>;
    }
    
    if (!bolaoId) return <div>ID do bolão não encontrado.</div>;
    
    if (participantes.length === 0 && jogos.length === 0 && loadingPart) {
         return (
            <div className="p-6">
                <LoadingSpinner 
                    message="Carregando dados do bolão..." 
                    position="centered"
                    size="lg"
                />
            </div>
         );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
                Gerenciar Bolão #{bolaoId}: <span className="text-blue-600">{nomeBolao}</span>
            </h1>

            <Section title="Adicionar Jogos" className="mb-6">
                Adicionar jogos ao bolão ( sera feito ainda )
            </Section>

            <Section title="Tabela de Palpites" className="mb-6">
                <BolaoMatrixTable 
                    jogos={jogos}
                    participantes={participantes}
                    palpites={palpites}
                    onSavePalpite={savePalpite}
                />
            </Section>

            <ParticipantesSection 
                participantes={participantes}
                onAdd={addParticipante}
                onRemove={(id) => removeParticipante(bolaoId!, id)}
            />

            {(loadingPart || loadingJogos || loadingPalpites) && (
                <LoadingSpinner 
                    message="Salvando alterações..." 
                    position="fixed"
                />
            )}
            
        </div>
    );
};

export default EditarBolaoPage;