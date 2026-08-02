import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Hooks
import { useParticipantes } from "./hooks/useParticipantes";
import { useJogos } from "@/shared/hooks/useJogos";
import { useTimes } from "@/shared/hooks/useTimes";
import { usePalpites } from "./hooks/usePalpites";
import { jogosService } from "@/shared/services/jogos-service";

// Componentes
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Section } from "./components/Section";
import { Button } from "@/shared/components/Button";
import { ExportButtons } from "@/shared/components/ExportButtons";
import type { JogoFormData } from "@/pages/admin/Jogos/components/JogoFormModal";

// Features
import { BolaoMatrixTable } from "./features/tabela-palpites/tabela-palpites";
import { ParticipantesSection } from "./features/secao-participantes/secaoParticipante";
import { AdicionarJogosModal } from "./features/adicionar-jogos/AdicionarJogosModal";
import { JogoFormModal } from "@/pages/admin/Jogos/components/JogoFormModal";
import { PalpiteSheet } from "./features/palpitar/PalpiteSheet";
import { ParticipantesPalpiteList } from "./features/palpitar/ParticipantesPalpiteList";

// Interfaces
import type { Participante } from "@/shared/interfaces/participante";

// Contexto
import { BolaoProvider } from "./context/bolao-context";

export const EditarBolaoPage = () => {
    const { id: bolaoId } = useParams();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const { participantes, addParticipante, removeParticipante, loading: loadingPart } = useParticipantes(bolaoId);
    const { jogos, loading: loadingJogos, refresh: refreshJogos } = useJogos(bolaoId);
    const { palpites, savePalpite, loading: loadingPalpites, refresh: refreshPalpites } = usePalpites(bolaoId);
    const { allTeams, carregarTimes } = useTimes();

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [criarModalOpen, setCriarModalOpen] = useState(false);
    const [reloadToken, setReloadToken] = useState(0);
    const [palpitando, setPalpitando] = useState<Participante | null>(null);

    useEffect(() => { carregarTimes(); }, [carregarTimes]);

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

    // Cria o jogo e já vincula ao bolão — era o motivo de o usuário estar criando.
    const handleCriarJogo = async (dados: JogoFormData) => {
        const novo = await jogosService.create(dados);
        if (novo?.id) {
            await jogosService.addJogoToBolao(bolaoId!, String(novo.id));
            await refreshJogos();
        }
        setReloadToken((t) => t + 1);
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
                            <Button onClick={() => setAddModalOpen(true)}>+ Adicionar / criar jogos</Button>
                        </div>
                    </div>
                </Section>

                {/* PALPITES — lista guiada no mobile, matriz no desktop */}
                <Section title="Palpites" className="mb-6">
                    <div className="md:hidden">
                        <ParticipantesPalpiteList
                            participantes={participantes}
                            jogos={jogos}
                            onPalpitar={setPalpitando}
                        />
                    </div>
                    <div className="hidden md:block">
                        <BolaoMatrixTable jogos={jogos} participantes={participantes} />
                    </div>
                </Section>

                {/* PARTICIPANTES */}
                <ParticipantesSection
                    participantes={participantes}
                    onAdd={addParticipante}
                    onRemove={(id) => removeParticipante(bolaoId!, id)}
                />

                {/* EXPORTAR */}
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
                    bolaoId={bolaoId}
                    jogosNoBolao={jogos}
                    reloadToken={reloadToken}
                    onAdicionado={refreshJogos}
                    onCriarNovo={() => setCriarModalOpen(true)}
                />

                <JogoFormModal
                    isOpen={criarModalOpen}
                    onClose={() => setCriarModalOpen(false)}
                    times={allTeams}
                    onSubmit={handleCriarJogo}
                />

                <PalpiteSheet
                    isOpen={palpitando !== null}
                    onClose={() => setPalpitando(null)}
                    bolaoId={bolaoId}
                    participante={palpitando}
                    jogos={jogos}
                    onSalvo={refreshPalpites}
                />
            </div>
        </BolaoProvider>
    );
};

export default EditarBolaoPage;