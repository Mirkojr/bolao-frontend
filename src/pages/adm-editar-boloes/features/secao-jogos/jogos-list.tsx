interface JogosListProps {
    jogos: any[];
    loading: boolean;
}

export const JogosList = ({ jogos, loading }: JogosListProps) => {


    const formatarData = (dataString: string | Date) => {
        if (!dataString) return '-';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', { 
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
        });
    };

    // Essa função descobre como exibir o nome, seja string ou objeto
    const getNomeTime = (time: any) => {
        if (!time) return "---";
        if (typeof time === 'string') return time;
        
        return time.nome || time.name || time.label || JSON.stringify(time);
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Carregando jogos...</div>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                Jogos do Bolão
            </h2>

            {jogos.length === 0 ? (
                <div className="p-4 bg-gray-100 rounded text-center text-gray-500">
                    Nenhum jogo cadastrado.
                </div>
            ) : (
                <div className="space-y-3">
                    {jogos.map((jogo) => (
                        <div key={jogo.id} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col items-center">
                            
                            {/* Data */}
                            <span className="text-xs text-gray-500 mb-2">
                                {formatarData(jogo.data_jogo)}
                            </span>

                            {/* Placar / Times */}
                            <div className="flex items-center justify-between w-full max-w-md gap-2">
                                {/* Time A */}
                                <div className="flex-1 text-center font-semibold text-lg truncate">
                                    {getNomeTime(jogo.timeA || jogo.timeA)}
                                </div>

                                {/* Placar */}
                                <div className="min-w-20 text-center">
                                    {jogo.status === 'FINALIZADO' ? (
                                        <span className="font-bold text-xl text-gray-800">
                                            {jogo.gol_a_real} x {jogo.gol_b_real}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 font-bold text-lg">VS</span>
                                    )}
                                </div>

                                {/* Time B */}
                                <div className="flex-1 text-center font-semibold text-lg truncate">
                                    {getNomeTime(jogo.timeB || jogo.timeB)}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mt-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                    jogo.status === 'FINALIZADO' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {jogo.status || 'AGENDADO'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}