import { useRef, useState } from "react";
import { BottomSheetModal } from "@/shared/components/BottomSheetModal";
import { Button } from "@/shared/components/Button";
import { PlacarStepper } from "@/shared/components/PlacarStepper";
import { rotuloDataHora } from "@/shared/utils/data-jogo";
import { usePalpiteSessao } from "../../hooks/usePalpiteSessao";
import { useBolaoContext } from "../../context/bolao-context";
import type { Jogo } from "@/shared/interfaces/jogo";
import type { Participante } from "@/shared/interfaces/participante";

const ATALHOS = [
    { a: 1, b: 0 }, { a: 2, b: 0 }, { a: 2, b: 1 },
    { a: 0, b: 0 }, { a: 1, b: 1 },
    { a: 0, b: 1 }, { a: 0, b: 2 }, { a: 1, b: 2 },
];

const nomeTime = (t: any) => (!t ? "?" : typeof t === "string" ? t : t.nome ?? t.sigla ?? "?");
const siglaTime = (t: any) => (!t ? "?" : typeof t === "string" ? t : t.sigla ?? t.nome ?? "?");

interface Props {
    isOpen: boolean;
    onClose: () => void;
    bolaoId: string;
    participante: Participante | null;
    jogos: Jogo[];
    onSalvo: () => void;
}

export const PalpiteSheet = ({ isOpen, onClose, bolaoId, participante, jogos, onSalvo }: Props) => {
    const { getPalpite } = useBolaoContext();
    const [modoLista, setModoLista] = useState(false);
    const toqueX = useRef<number | null>(null);

    const s = usePalpiteSessao({
        bolaoId,
        participanteId: participante?.id ?? null,
        jogos,
        getPalpite,
    });

    if (!participante) return null;

    const nome = participante.nome ?? participante.nome_avulso ?? "Participante";
    const pct = s.total ? Math.round((s.preenchidos / s.total) * 100) : 0;

    const fechar = () => {
        if (s.pendentes > 0 && !confirm(`Você tem ${s.pendentes} palpite(s) não salvos. Sair mesmo assim?`)) return;
        onClose();
    };

    const salvarESair = async () => {
        const ok = await s.salvar();
        if (ok) { onSalvo(); onClose(); }
    };

    const onTouchStart = (e: React.TouchEvent) => { toqueX.current = e.touches[0].clientX; };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (toqueX.current === null) return;
        const delta = e.changedTouches[0].clientX - toqueX.current;
        if (Math.abs(delta) > 60) s.irPara(s.indice + (delta < 0 ? 1 : -1));
        toqueX.current = null;
    };

    const jogo = s.jogoAtual;
    const r = jogo ? s.rascunhos[jogo.id] ?? { a: 0, b: 0 } : { a: 0, b: 0 };

    return (
        <BottomSheetModal isOpen={isOpen} onClose={fechar} title={`Palpites de ${nome}`} tall flushBody
            footer={
                <div className="space-y-3">
                    {s.erro && <p className="text-sm text-red-600">{s.erro}</p>}

                    {s.salvando ? (
                        <div className="space-y-2">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                <div className="h-full bg-green-500 transition-all" style={{ width: `${s.progresso}%` }} />
                            </div>
                            <p className="text-center text-sm text-gray-500">Salvando… {s.progresso}%</p>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            {!modoLista && (
                                <>
                                    <Button variant="secondary" onClick={() => s.irPara(s.indice - 1)} disabled={s.indice === 0}>
                                        ←
                                    </Button>
                                    <Button variant="secondary" onClick={() => s.irPara(s.indice + 1)} disabled={s.indice >= s.total - 1}>
                                        Próximo
                                    </Button>
                                </>
                            )}
                            <Button onClick={salvarESair} disabled={s.pendentes === 0}>
                                {s.pendentes > 0 ? `Salvar ${s.pendentes}` : "Tudo salvo"}
                            </Button>
                        </div>
                    )}
                </div>
            }
        >
            {/* Progresso + alternância de modo */}
            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{s.preenchidos} de {s.total} palpitados</span>
                    <button onClick={() => setModoLista((v) => !v)} className="font-medium text-blue-600">
                        {modoLista ? "Modo foco" : "Revisar todos"}
                    </button>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
            </div>

            {/* MODO FOCO */}
            {!modoLista && jogo && (
                <div className="px-4 py-6" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                    <p className="mb-1 text-center text-xs uppercase tracking-wide text-gray-400">
                        Jogo {s.indice + 1} de {s.total}
                    </p>
                    <p className="mb-6 text-center text-sm text-gray-500">
                        {jogo.data_jogo ? rotuloDataHora(jogo.data_jogo) : "Data a definir"}
                    </p>

                    <div className="flex items-start justify-center gap-3">
                        <div className="flex w-24 flex-col items-center gap-3">
                            <span className="text-center text-sm font-semibold leading-tight text-gray-800">
                                {nomeTime(jogo.timeA)}
                            </span>
                            <PlacarStepper valor={r.a} rotulo={nomeTime(jogo.timeA)}
                                onChange={(v) => s.definir(jogo.id, { a: v })} />
                        </div>

                        <span className="pt-12 text-2xl font-light text-gray-300">×</span>

                        <div className="flex w-24 flex-col items-center gap-3">
                            <span className="text-center text-sm font-semibold leading-tight text-gray-800">
                                {nomeTime(jogo.timeB)}
                            </span>
                            <PlacarStepper valor={r.b} rotulo={nomeTime(jogo.timeB)}
                                onChange={(v) => s.definir(jogo.id, { b: v })} />
                        </div>
                    </div>

                    <p className="mb-2 mt-8 text-center text-xs uppercase tracking-wide text-gray-400">
                        Placares comuns
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {ATALHOS.map(({ a, b }) => {
                            const ativo = r.a === a && r.b === b;
                            return (
                                <button key={`${a}-${b}`} onClick={() => s.definir(jogo.id, { a, b })}
                                    className={`h-10 min-w-14 rounded-full px-4 text-sm font-semibold tabular-nums transition
                                        ${ativo ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 active:bg-gray-200"}`}
                                >
                                    {a}-{b}
                                </button>
                            );
                        })}
                    </div>

                    {jogo.status === "FINALIZADO" && jogo.gol_a_real != null && (
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Resultado real: <b className="tabular-nums">{jogo.gol_a_real} - {jogo.gol_b_real}</b>
                        </p>
                    )}
                </div>
            )}

            {/* MODO LISTA */}
            {modoLista && (
                <ul className="divide-y divide-gray-100">
                    {jogos.map((j, i) => {
                        const rj = s.rascunhos[j.id] ?? { a: 0, b: 0 };
                        const salvo = getPalpite(participante.id, j.id);
                        return (
                            <li key={j.id}
                                onClick={() => { s.irPara(i); setModoLista(false); }}
                                className="flex items-center gap-3 px-4 py-3 active:bg-gray-50"
                            >
                                <span className="flex-1 truncate text-sm text-gray-700">
                                    {siglaTime(j.timeA)} <span className="text-gray-300">×</span> {siglaTime(j.timeB)}
                                </span>
                                <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-bold tabular-nums text-gray-800">
                                    {rj.a} - {rj.b}
                                </span>
                                <span className={`text-xs ${salvo ? "text-green-600" : "text-amber-500"}`}>
                                    {salvo ? "✓" : "•"}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </BottomSheetModal>
    );
};