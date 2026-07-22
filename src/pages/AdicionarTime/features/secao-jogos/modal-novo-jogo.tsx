// features/jogos/components/modal-novo-jogo.tsx
import { useState, useEffect } from 'react';
import ModalGenerico from '@/shared/components/Modal';
import { useTimes } from '@/shared/hooks/useTimes';
import { SelecaoTime } from './selecao-time';

interface ModalNovoJogoProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onConfirm: (timeA: string, timeB: string) => void;
}

export const ModalNovoJogo = ({ isOpen, setIsOpen, onConfirm }: ModalNovoJogoProps) => {
    const { allTeams, carregarTimes } = useTimes();
    const [teamA, setTeamA] = useState<string | null>(null);
    const [teamB, setTeamB] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) carregarTimes();
    }, [isOpen, carregarTimes]);

    const handleSalvar = () => {
        if (teamA && teamB) {
            onConfirm(teamA, teamB);
            setIsOpen(false);
            setTeamA(null);
            setTeamB(null);
        }
    };

    return (
        <ModalGenerico setModalOpen={setIsOpen} isOpen={isOpen}>
            <div className="w-full max-w-md px-4 sm:px-6">
                <h2 className="mb-1 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Novo jogo
                </h2>
                <p className="mb-6 text-center text-sm text-gray-500">
                    Selecione os dois times do confronto.
                </p>

                <div className="flex flex-col gap-4">
                    <SelecaoTime
                        label="Time A (Mandante)"
                        selectedTeam={teamA}
                        onSelect={setTeamA}
                        times={allTeams}
                    />

                    <div className="flex items-center justify-center">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                            X
                        </span>
                    </div>

                    <SelecaoTime
                        label="Time B (Visitante)"
                        selectedTeam={teamB}
                        onSelect={setTeamB}
                        times={allTeams}
                    />

                    <button
                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!teamA || !teamB}
                        onClick={handleSalvar}
                    >
                        Criar jogo
                    </button>
                </div>
            </div>
        </ModalGenerico>
    );
};