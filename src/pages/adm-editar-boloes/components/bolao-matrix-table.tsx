import { PalpiteCell } from "./palpite-cell";
import type { Jogo } from "../../../shared/interfaces/jogo";
import type { Participante } from "../../../shared/interfaces/participante";
import type { Palpite } from "../../../shared/interfaces/palpite";

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
                Nenhum participante adicionado ainda. Use o formulário acima.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                    <tr>
                        <th className="px-4 py-3 sticky left-0 bg-gray-100 border-r z-10">Participante</th>
                        {jogos.map(jogo => {
                            // Renderizar com segurança verificando se os dados existem
                            const timeAName = typeof jogo.timeA === 'string' ? jogo.timeA : jogo.timeA?.sigla || jogo.timeA?.nome || '?';
                            const timeBName = typeof jogo.timeB === 'string' ? jogo.timeB : jogo.timeB?.sigla || jogo.timeB?.nome || '?';
                            
                            return (
                                <th key={jogo.id} className="px-4 py-3 text-center border-l min-w-30">
                                    {timeAName} <span className="text-gray-400">x</span> {timeBName}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {participantes.map(p => (
                        <tr key={p.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 font-bold sticky left-0 bg-white border-r">
                                {p.nome}
                            </td>
                            {jogos.map(jogo => {
                                const palpite = palpites.find(
                                    pl => pl.participanteId === p.id && pl.jogoId === jogo.id
                                );
                                return (
                                    <td key={`${p.id}-${jogo.id}`} className="px-2 py-2 text-center border-l">
                                        <PalpiteCell 
                                            palpite={palpite}
                                            onSave={async (pa, pb) => onSavePalpite(p.id, jogo.id, pa, pb)}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};