import { useTimes } from '@/shared/hooks/useTimes';

export const CriarTime = () => {

    const { criarTime } = useTimes();

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Criar Novo Time</h2>
            <form className="w-full max-w-sm bg-white p-4 rounded shadow-sm border border-gray-100" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const nome = formData.get('nome') as string;
                if (nome.trim()) {
                    criarTime({ nome, sigla: nome.substring(0, 3).toUpperCase() });
                    e.currentTarget.reset();
                }
            }}>
                <div className="mb-4">
                    <label htmlFor="nome" className="block text-gray-700 font-semibold mb-2">Nome do Time</label>
                    <input
                        type="text"
                        name="nome"
                        id="nome"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite o nome do time"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Criar Time
                </button>
            </form>
        </div>
    )
}

