import type { Jogo } from '@/shared/interfaces/jogo';

interface JogosListProps {
    jogos: Jogo[];
    loading: boolean;
    onJogoClick?: (jogo: Jogo) => void;
}

export const JogosList = ({ jogos, loading, onJogoClick }: JogosListProps) => {
    const formatarData = (dataString: string | Date) => {
        if (!dataString) return '-';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Descobre como exibir o nome, seja string ou objeto
    const getNomeTime = (time: any) => {
        if (!time) return '---';
        if (typeof time === 'string') return time;
        return time.nome || time.name || time.label || JSON.stringify(time);
    };

    return (
        <div className="w-full">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Todos os jogos
            </h3>

            {loading ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-28 animate-pulse rounded-xl border border-gray-100 bg-gray-100"
                        />
                    ))}
                </div>
            ) : jogos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
                    Nenhum jogo cadastrado ainda.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {jogos.map((jogo) => (
                        <button
                            key={jogo.id}
                            type="button"
                            onClick={() => onJogoClick?.(jogo)}
                            className="group flex w-full cursor-pointer flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        >
                            {/* Data */}
                            <span className="mb-2 text-xs font-medium text-gray-400">
                                {formatarData(jogo.data_jogo)}
                            </span>

                            {/* Times / placar */}
                            <div className="flex w-full items-center justify-between gap-2">
                                <div className="flex-1 truncate text-center text-base font-semibold text-gray-800">
                                    {getNomeTime(jogo.timeA)}
                                </div>

                                <div className="min-w-16 text-center">
                                    {jogo.status === 'FINALIZADO' ? (
                                        <span className="text-xl font-extrabold text-gray-900">
                                            {jogo.gol_a_real} <span className="text-gray-300">x</span>{' '}
                                            {jogo.gol_b_real}
                                        </span>
                                    ) : (
                                        <span className="rounded-lg bg-gray-100 px-2 py-1 text-sm font-bold text-gray-400">
                                            VS
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 truncate text-center text-base font-semibold text-gray-800">
                                    {getNomeTime(jogo.timeB)}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mt-3">
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                        jogo.status === 'FINALIZADO'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-amber-100 text-amber-700'
                                    }`}
                                >
                                    {jogo.status || 'AGENDADO'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};