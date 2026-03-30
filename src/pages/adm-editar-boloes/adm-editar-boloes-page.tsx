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
import { useState } from "react";
import { useBoloes } from "@/shared/hooks/useBoloes";

export const EditarBolaoPage = () => {
    const { id: bolaoId } = useParams(); 
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    
    // Hooks de Dados
    const { participantes, addParticipante, removeParticipante, loading: loadingPart } = useParticipantes(bolaoId);
    const { jogos, addJogoToBolao, loading: loadingJogos } = useJogos(bolaoId);
    const { todosJogos } = useJogos();
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
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p className="text-gray-600">
                            Adicione jogos ao bolão para que os participantes possam fazer seus palpites.
                        </p>
                        <div>
                            <select
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                onChange={async (e) => {
                                    const jogoId = e.target.value;
                                    if (jogoId) {
                                        await addJogoToBolao(jogoId);
                                        e.target.value = ""; // Reseta o select
                                    }
                                }}
                            >
                                <option value="">Selecione um jogo para adicionar</option>
                                {todosJogos.map((jogo) => (
                                    <option key={jogo.id} value={jogo.id}>
                                        {jogo.timeA?.nome || "Time A"} vs {jogo.timeB?.nome || "Time B"} - {new Date(jogo.data_jogo).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
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