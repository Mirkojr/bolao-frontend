import { MatrixRow } from "./matrix-row";
import type { Jogo } from "@/shared/interfaces/jogo";
import type { Participante } from "@/shared/interfaces/participante";
import type { Palpite } from "@/shared/interfaces/palpite";

const getTeamName = (time: any) => {
    if (!time) return '?';
    return typeof time === 'string' ? time : (time.sigla || time.nome || '?');
};


interface BolaoMatrixTableProps {
    jogos: Jogo[];
    participantes: Participante[];
    palpites: Palpite[];
    onSavePalpite: (partId: string, jogoId: string, pa: number, pb: number) => void;
}

const semParticipantesMsg = () => (
    <div className="p-8 text-center text-gray-500 bg-white rounded shadow border border-gray-200">
        Nenhum participante adicionado ainda.
    </div>
);

export const BolaoMatrixTable = ({ jogos, participantes, palpites, onSavePalpite }: BolaoMatrixTableProps) => {
    if (participantes.length === 0) {
        return semParticipantesMsg();
    }
    
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="w-full text-sm text-left">

                {/* Cabeçalho da tabela */}
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                    <tr>
                        <th className="px-4 py-3 sticky left-0 bg-gray-100 border-r z-10">
                            Participante
                        </th>
                        {jogos.map(jogo => (
                            <th key={jogo.id} className="px-4 py-3 text-center border-l min-w-30">
                                {getTeamName(jogo.timeA)} <span className="text-gray-400">x</span> {getTeamName(jogo.timeB)}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Linhas dos participantes */}
                <tbody>
                    {participantes.map(p => (
                        <MatrixRow 
                            key={p.id}
                            participante={p}
                            jogos={jogos} 
                            palpites={palpites}
                            onSave={onSavePalpite}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};