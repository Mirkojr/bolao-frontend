import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Hooks
import { useParticipantes } from "./hooks/useParticipantes";
import { useJogos } from "@/shared/hooks/useJogos";
import { usePalpites } from "./hooks/usePalpites";

// Componentes
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Section } from "./components/Section";
import { Button } from "@/shared/components/Button";
import { ExportButtons } from "@/shared/components/ExportButtons";

// Features
import { BolaoMatrixTable } from "./features/tabela-palpites/tabela-palpites";
import { ParticipantesSection } from "./features/secao-participantes/secaoParticipante";
import { AdicionarJogosModal } from "./features/adicionar-jogos/AdicionarJogosModal";
import { CriarJogoModal } from "./features/adicionar-jogos/CriarJogoModal";

// Contexto
import { BolaoProvider } from "./context/bolao-context";

export const EditarBolaoPage = () => {
    const { id: bolaoId } = useParams();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // Hooks de Dados
    const { participantes, addParticipante, removeParticipante, loading: loadingPart } = useParticipantes(bolaoId);
    const { jogos, addJogoToBolao, loading: loadingJogos } = useJogos(bolaoId);
    const { addJogo, carregarJogos } = useJogos(); // jogos globais (criação)
    const { palpites, savePalpite, loading: loadingPalpites } = usePalpites(bolaoId);

    // Estado dos modais
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [criarModalOpen, setCriarModalOpen] = useState(false);
    const [reloadToken, setReloadToken] = useState(0);

    const bolaoState = location.state?.bolaoData;
    const nomeBolao = bolaoState?.nome || " Bolão ";

    if (!isAuthenticated) {
        return <div className="p-6 text-red-500">Acesso negado. Por favor, faça login como administrador.</div>;
    }
    if (!bolaoId) return <div>ID do bolão não encontrado.</div>;

    if (participantes.length === 0 && jogos.length === 0 && loadingPart) {
        return (
            <div className="p-6">
                <LoadingSpinner message="Carregando dados do bolão..." position="centered" size="lg" />
            </div>
        );
    }

    const handleCriarJogo = async (timeA: string, timeB: string, dataJogo: string) => {
        await addJogo(timeA, timeB, dataJogo);
        await carregarJogos();
        setReloadToken((t) => t + 1); // faz o modal de seleção recarregar já com o novo jogo
    };

    return (
        <BolaoProvider palpites={palpites} onSavePalpite={savePalpite}>
            <div className="p-6 bg-gray-50 min-h-screen">
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
                            <Button onClick={() => setAddModalOpen(true)}>
                                + Adicionar / criar jogos
                            </Button>
                        </div>
                    </div>
                </Section>

                {/* TABELA DE PALPITES */}
                <Section title="Tabela de Palpites" className="mb-6">
                    <BolaoMatrixTable jogos={jogos} participantes={participantes} />
                </Section>

                {/* SECAO DE PARTICIPANTES */}
                <ParticipantesSection
                    participantes={participantes}
                    onAdd={addParticipante}
                    onRemove={(id) => removeParticipante(bolaoId!, id)}
                />

                {/* SECAO DE EXPORTACAO */}
                <Section title="Exportar Bolão" className="mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-gray-600 mb-4">Exporte os dados do bolão em formato Excel ou PDF.</p>
                        <ExportButtons bolaoId={bolaoId} />
                    </div>
                </Section>

                {(loadingPart || loadingJogos || loadingPalpites) && (
                    <LoadingSpinner message="Salvando alterações..." position="fixed" />
                )}

                {/* MODAIS */}
                <AdicionarJogosModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    jogosNoBolao={jogos}
                    reloadToken={reloadToken}
                    onAdd={async (jogoId) => { await addJogoToBolao(jogoId); }}
                    onCriarNovo={() => setCriarModalOpen(true)}
                />

                <CriarJogoModal
                    isOpen={criarModalOpen}
                    onClose={() => setCriarModalOpen(false)}
                    onCriar={handleCriarJogo}
                />
            </div>
        </BolaoProvider>
    );
};

export default EditarBolaoPage;