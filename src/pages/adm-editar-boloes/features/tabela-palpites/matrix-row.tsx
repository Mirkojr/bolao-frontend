import type { Jogo } from "@/shared/interfaces/jogo";
import type { Palpite } from "@/shared/interfaces/palpite";
import type { Participante } from "@/shared/interfaces/participante";
import { PalpiteCell } from "./palpite-cell";

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

export const MatrixRow = ({ participante, jogos, palpites, onSave }: MatrixRowProps) => {
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
