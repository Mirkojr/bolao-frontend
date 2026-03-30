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
import { ParticipantesSection } from "./features/secao-participantes/secaoParticipante"; 

// Contexto
import { BolaoProvider } from "./context/bolao-context";

export const EditarBolaoPage = () => {
    const { id: bolaoId } = useParams(); 
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    
    // Hooks de Dados
    const { participantes, addParticipante, removeParticipante, loading: loadingPart } = useParticipantes(bolaoId);
    const { jogos, addJogoToBolao, loading: loadingJogos } = useJogos(bolaoId);
    const { todosJogos } = useJogos();
    const { palpites, savePalpite, loading: loadingPalpites } = usePalpites(bolaoId);

    // Pegamos o nome do bolão do state da rota, se disponível
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

    // Filtramos os jogos disponíveis para adicionar, removendo os que já estão no bolão
    const jogosDisponiveis = todosJogos.filter(
        (jogoDisponivel) => !jogos.some((jogoNoBolao) => jogoNoBolao.id === jogoDisponivel.id)
    );

    const handleAddJogo = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const jogoId = e.target.value;
        if (jogoId) {
            await addJogoToBolao(jogoId);
            e.target.value = ""; // Reseta o select
        }
    };

    return (
        <BolaoProvider palpites={palpites} onSavePalpite={savePalpite}>
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* TITULO DO BOLAO */}
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
                Gerenciar Bolão #{bolaoId}: <span className="text-blue-600">{nomeBolao}</span>
            </h1>

            {/* SECAO DE ADICIONAR JOGOS */}
            <Section title="Adicionar Jogos" className="mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p className="text-gray-600">
                            Adicione jogos ao bolão para que os participantes possam fazer seus palpites.
                        </p>
                        <div>
                            <select
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                onChange={handleAddJogo}
                            >
                                <option value="">Selecione um jogo para adicionar</option>
                                {jogosDisponiveis.map((jogo) => {
                                    const timeA = jogo.timeA?.nome || "Time A";
                                    const timeB = jogo.timeB?.nome || "Time B";
                                    const data = new Date(jogo.data_jogo).toLocaleDateString();

                                    return (
                                        <option key={jogo.id} value={jogo.id}>
                                            {timeA} vs {timeB} - {data}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </Section>

            {/* TABELA DE PALPITES */}
            <Section title="Tabela de Palpites" className="mb-6">
                <BolaoMatrixTable 
                    jogos={jogos}
                    participantes={participantes}
                    />
            </Section>

                                
            {/* SECAO DE PARTICIPANTES */}
            <ParticipantesSection 
                participantes={participantes}
                onAdd={addParticipante}
                onRemove={(id) => removeParticipante(bolaoId!, id)}
            />

            {/* SPINNER DE LOADING */}
            {(loadingPart || loadingJogos || loadingPalpites) && (
                <LoadingSpinner 
                message="Salvando alterações..." 
                position="fixed"
                />
            )}
            
        </div>
        </BolaoProvider>
    );
};

export default EditarBolaoPage;