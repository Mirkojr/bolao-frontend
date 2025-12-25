import type { Participante } from "@/shared/interfaces/participante";

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
                <div 
                    key={p.id} 
                    className="flex justify-between items-center p-4 bg-white rounded shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
                >
                    <p className="font-medium text-gray-800">
                        {p.nome} <span className="text-xs text-gray-400 ml-1">#{p.id}</span>
                    </p>

                    <button 
                        onClick={() => {
                            if (confirmacaoRemocao(p.nome)) {
                                onRemove(p.id);
                            }
                        }}
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 border border-transparent hover:border-red-200 rounded transition-all"
                    >
                        Deletar
                    </button>
                </div>
            ))}
        </div>
    );
}