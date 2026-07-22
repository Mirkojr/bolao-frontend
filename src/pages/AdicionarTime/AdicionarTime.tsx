import { useAuth } from '@/context/AuthContext';
import { SecaoJogos } from './features/secao-jogos/secao-jogos';
import { useJogos } from '@/shared/hooks/useJogos';
import { CriarTime } from './features/secao-jogos/criar-time';

export const AdicionarTimePage = () => {
    const { isAuthenticated } = useAuth();

    // Hooks sempre no topo (antes de qualquer return condicional)
    const {
        todosJogos,
        addJogo,
        updateJogo,
        loading: loadingJogos,
        filtros,
    } = useJogos();

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
                        🔒
                    </div>
                    <h2 className="text-lg font-semibold text-red-700">Acesso negado</h2>
                    <p className="mt-1 text-sm text-red-500">
                        Faça login como administrador para gerenciar times e jogos.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Cabeçalho */}
                <header className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Gerenciar times e jogos
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Cadastre novos times, crie confrontos e atualize os placares do bolão.
                    </p>
                </header>

                {/* Coluna única no mobile, 2 colunas no desktop */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start">
                    {/* Criar time (fixo no desktop) */}
                    <div className="lg:sticky lg:top-6">
                        <CriarTime />
                    </div>

                    {/* Seção de jogos */}
                    <SecaoJogos
                        jogos={todosJogos}
                        loading={loadingJogos}
                        onAddJogo={addJogo}
                        onUpdateJogo={updateJogo}
                        filtros={filtros}
                    />
                </div>
            </div>
        </div>
    );
};