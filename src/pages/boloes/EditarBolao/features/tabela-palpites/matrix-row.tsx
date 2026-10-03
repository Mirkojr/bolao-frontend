import type { Jogo } from "@/shared/interfaces/jogo";
import type { Participante } from "@/shared/interfaces/participante";
import { PalpiteCell } from "./palpite-cell";


import { useBolaoContext } from "../../context/bolao-context"; 

interface MatrixRowProps {
    participante: Participante;
    jogos: Jogo[];
}

export const MatrixRow = ({ participante, jogos }: MatrixRowProps) => {
    
    const { getPalpite, onSavePalpite } = useBolaoContext();

    return (
        <tr className="border-t hover:bg-gray-50">
            <td className="px-4 py-3 font-bold sticky left-0 bg-white border-r shadow-sm whitespace-nowrap">
                {participante.nome}
            </td>
            {jogos.map(jogo => {
                
                const palpite = getPalpite(participante.id, jogo.id); 

                return (
                    <td key={`${participante.id}-${jogo.id}`} className="px-2 py-2 text-center border-l">
                        <PalpiteCell
                            jogo={jogo}
                            palpite={palpite}
                            onSave={async (pa, pb) => onSavePalpite(String(participante.id), String(jogo.id), pa, pb)}
                        />
                    </td>
                );
            })}
        </tr>
    );
};