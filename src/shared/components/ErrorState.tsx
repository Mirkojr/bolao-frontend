import { ApiError } from '@/shared/api/httpClient';

interface ErrorStateProps {
    erro: unknown;
    onTentarNovamente?: () => void;
}

export function ErrorState({ erro, onTentarNovamente }: ErrorStateProps) {
    const apiErro = erro instanceof ApiError ? erro : null;
    const conexao = apiErro?.isConexao ?? false;

    const titulo = conexao ? 'Sem conexão com o servidor' : 'Algo deu errado';
    const mensagem =
        apiErro?.message ??
        (erro instanceof Error ? erro.message : 'Não foi possível carregar as informações.');

    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-8 text-center">
            <span className="text-3xl">{conexao ? '📡' : '⚠️'}</span>
            <p className="font-semibold text-gray-800">{titulo}</p>
            <p className="max-w-sm text-sm text-gray-500">{mensagem}</p>

            {onTentarNovamente && (
                <button
                    type="button"
                    onClick={onTentarNovamente}
                    className="mt-2 h-11 rounded-lg bg-blue-600 px-5 font-medium text-white transition hover:bg-blue-700"
                >
                    Tentar novamente
                </button>
            )}
        </div>
    );
}