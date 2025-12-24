import type { Participante } from "@/shared/interfaces/participante"

interface ParticipanteListProps {
    participantes: Participante[];
    onRemove: ( id: number ) => void;
}

const confirmacaoRemocao = (nome: string) => {
    return window.confirm(`Tem certeza que deseja remover o participante "${nome}"? Esta ação não pode ser desfeita.`);
}

export const ParticipanteList = ( { participantes, onRemove } : ParticipanteListProps) => {

    if (!participantes || participantes.length === 0) {
        return <p className="text-gray-500">Nenhum participante encontrado.</p>;
    }

    return (
        <div>
            {participantes.map((p) => (
                <div 
                    key={p.id} 
                    // 'flex justify-between' empurra o texto pra esquerda e botão pra direita
                    className="flex justify-between items-center p-4 mb-2 bg-white rounded shadow border border-gray-200"
                >
                    <p className="font-medium text-gray-800">
                        {p.nome} <span className="text-xs text-gray-400">(ID: {p.id})</span>
                    </p>

                    <button 
                        onClick={() => {
                            const confirmou = confirmacaoRemocao(p.nome);
                            
                            if (confirmou) {
                                onRemove(p.id);
                            }
                        }}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 border border-transparent hover:border-red-200 rounded transition-colors"
                    >
                        Deletar
                    </button>
                </div>
            ))}
        </div>
    )
}