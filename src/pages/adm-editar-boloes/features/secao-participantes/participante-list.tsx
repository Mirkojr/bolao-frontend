import type { Participante } from "@/shared/interfaces/participante";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";

interface ParticipanteListProps {
    participantes: Participante[];
    onRemove: (id: number) => void;
}

const confirmacaoRemocao = (nome: string) => {
    return window.confirm(`Tem certeza que deseja remover o participante "${nome}"? Esta ação não pode ser desfeita.`);
}

export const ParticipanteList = ({ participantes, onRemove }: ParticipanteListProps) => {

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
                        onClick={() => {
                            if (confirmacaoRemocao(p.nome)) {
                                onRemove(p.id);
                            }
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 border-transparent hover:border-red-200"
                    >
                        Deletar
                    </Button>
                </Card>
            ))}
        </div>
    );
}