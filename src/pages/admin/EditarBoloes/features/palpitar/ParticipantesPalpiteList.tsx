import { useBolaoContext } from "../../context/bolao-context";
import type { Jogo } from "@/shared/interfaces/jogo";
import type { Participante } from "@/shared/interfaces/participante";

interface Props {
    participantes: Participante[];
    jogos: Jogo[];
    onPalpitar: (p: Participante) => void;
}

export const ParticipantesPalpiteList = ({ participantes, jogos, onPalpitar }: Props) => {
    const { getPalpite } = useBolaoContext();

    if (jogos.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                Adicione jogos ao bolão para começar a palpitar.
            </p>
        );
    }

    return (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white">
            {participantes.map((p) => {
                const feitos = jogos.filter((j) => getPalpite(p.id, j.id)).length;
                const pct = Math.round((feitos / jogos.length) * 100);
                const completo = feitos === jogos.length;

                return (
                    <li key={p.id} className="flex items-center gap-3 p-4">
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900">
                                {p.nome ?? p.nome_avulso}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className={`h-full rounded-full transition-all ${completo ? "bg-green-500" : "bg-blue-500"}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="shrink-0 text-xs tabular-nums text-gray-500">
                                    {feitos}/{jogos.length}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => onPalpitar(p)}
                            className={`h-11 shrink-0 rounded-xl px-4 text-sm font-semibold transition active:scale-95
                                ${completo
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-blue-600 text-white shadow-sm"}`}
                        >
                            {completo ? "Revisar" : "Palpitar"}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};