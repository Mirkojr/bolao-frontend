// features/jogos/components/modal-novo-jogo.tsx
import { useState, useEffect } from 'react';
import ModalGenerico from '@/shared/components/modal/Modal';
import { CardTitle } from '@/shared/components/card/Card';
import { Button } from '@/shared/components/button/Button';
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
            // Limpa estados
            setTeamA(null);
            setTeamB(null);
        }
    };

    return (
        <ModalGenerico setModalOpen={setIsOpen} isOpen={isOpen}>
            <CardTitle className="text-3xl text-center mb-4">NOVO JOGO</CardTitle>
            
            <div className="flex flex-col gap-4">
                <SelecaoTime 
                    label="Time A (Mandante)" 
                    selectedTeam={teamA} 
                    onSelect={setTeamA} 
                    times={allTeams} 
                />
                
                <div className="text-center font-bold text-gray-400">X</div>

                <SelecaoTime 
                    label="Time B (Visitante)" 
                    selectedTeam={teamB} 
                    onSelect={setTeamB} 
                    times={allTeams} 
                />

                <Button 
                    className="mt-4 bg-green-600 text-white hover:bg-green-700"
                    disabled={!teamA || !teamB}
                    onClick={handleSalvar}
                >
                    CRIAR JOGO
                </Button>
            </div>
        </ModalGenerico>
    );
};