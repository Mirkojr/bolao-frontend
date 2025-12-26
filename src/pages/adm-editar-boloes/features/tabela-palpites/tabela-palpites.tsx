import { MatrixRow } from "./matrix-row";
import { EmptyState } from "../../components/EmptyState";
import { TeamDisplay } from "../../components/TeamDisplay";
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

export const BolaoMatrixTable = ({ jogos, participantes, palpites, onSavePalpite }: BolaoMatrixTableProps) => {
    if (participantes.length === 0) {
        return (
            <EmptyState
                title="Nenhum participante"
                message="Adicione participantes para começar a registrar os palpites do bolão."
            />
        );
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
                                <TeamDisplay
                                    teamA={getTeamName(jogo.timeA)}
                                    teamB={getTeamName(jogo.timeB)}
                                    variant="compact"
                                />
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