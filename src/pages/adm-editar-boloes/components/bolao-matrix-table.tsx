import { PalpiteCell } from "./palpite-cell";
import type { Jogo } from "@/shared/interfaces/jogo";
import type { Participante } from "@/shared/interfaces/participante";
import type { Palpite } from "@/shared/interfaces/palpite";

const getTeamName = (time: any) => {
    if (!time) return '?';
    return typeof time === 'string' ? time : (time.sigla || time.nome || '?');
};

const findPalpite = (palpites: Palpite[], participanteId: number, jogoId: number) => {
    return palpites.find(pl => 
        Number(pl.participante_id) === Number(participanteId) && 
        Number(pl.jogo_id) === Number(jogoId)
    );
};

interface MatrixRowProps {
    participante: Participante;
    jogos: Jogo[];
    palpites: Palpite[];
    onSave: (partId: string, jogoId: string, pa: number, pb: number) => void;
}

const MatrixRow = ({ participante, jogos, palpites, onSave }: MatrixRowProps) => {
    return (
        <tr className="border-t hover:bg-gray-50">
            <td className="px-4 py-3 font-bold sticky left-0 bg-white border-r shadow-sm whitespace-nowrap">
                {participante.nome}
            </td>
            {jogos.map(jogo => {
                const palpite = findPalpite(palpites, Number(participante.id), jogo.id);
                return (
                    <td key={`${participante.id}-${jogo.id}`} className="px-2 py-2 text-center border-l">
                        <PalpiteCell
                            palpite={palpite}
                            onSave={async (pa, pb) => onSave(String(participante.id), String(jogo.id), pa, pb)}
                        />
                    </td>
                );
            })}
        </tr>
    );
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
            <div className="p-8 text-center text-gray-500 bg-white rounded shadow border border-gray-200">
                Nenhum participante adicionado ainda.
            </div>
        );
    }
    
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="w-full text-sm text-left">
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