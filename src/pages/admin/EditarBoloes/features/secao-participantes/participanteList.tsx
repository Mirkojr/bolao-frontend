import type { Participante } from "@/shared/interfaces/participante";
import { Card } from "../../../../../shared/components/Card";
import { Button } from "../../../../../shared/components/Button";
import ModalGenerico from "@/shared/components/Modal";
import { useState } from "react";

interface ParticipanteListProps {
    participantes: Participante[];
    onRemove: (id: number) => void;
}

export const ParticipanteList = ({ participantes, onRemove }: ParticipanteListProps) => {

    const [participanteParaRemover, setParticipanteParaRemover] = useState<Participante | null>(null);
    
    if (!participantes || participantes.length === 0) {
        return <p className="text-gray-500 p-4 text-center">Nenhum participante encontrado.</p>;
    }

    return (
        <div className="space-y-2">
            {participantes.map((p) => (
                <Card 
                    key={p.id}
                    variant="default"
                    hoverable
                    padding="md"
                    className="flex justify-between items-center"
                >
                    <p className="font-medium text-gray-800">
                        {p.nome} <span className="text-xs text-gray-400 ml-1">#{p.id}</span>
                    </p>

                    <Button
                        onClick={() => setParticipanteParaRemover(p)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 border-transparent hover:border-red-200"
                    >
                        Deletar
                    </Button>
        
                </Card>
            ))}

            <ModalGenerico 
                isOpen={!!participanteParaRemover} 
                setModalOpen={() => setParticipanteParaRemover(null)} 
            > 
                {/* Container com padding equilibrado e alinhamento central */}
                <div className="flex flex-col items-center p-6 text-center w-full h-full justify-between">
           
                    {/* Cabeçalho de Alerta */}
                    <div className="mt-4">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Excluir Participante</h3>
                        <p className="text-sm text-gray-500 mt-2 px-4">
                            Tem certeza que deseja remover <span className="font-semibold text-gray-800">{participanteParaRemover?.nome}</span>? Esta ação é irreversível.
                        </p>
                    </div>

                    <div className="w-full space-y-3 mt-8">
                        <Button 
                            onClick={() => {
                                if (participanteParaRemover) {
                                    onRemove(participanteParaRemover.id);
                                    setParticipanteParaRemover(null);
                                }
                            }}
                            variant="danger"
                            className="w-full py-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md active:scale-95 transition-all"
                        > 
                            Sim, excluir agora
                        </Button>
                        
                        <button 
                            onClick={() => setParticipanteParaRemover(null)}
                            className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </ModalGenerico>
        </div>
    );
}