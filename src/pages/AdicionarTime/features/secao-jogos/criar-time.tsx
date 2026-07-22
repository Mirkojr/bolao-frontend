import { useTimes } from '@/shared/hooks/useTimes';

export const CriarTime = () => {
    const { criarTime } = useTimes();

    return (
        <section className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    🛡️
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Criar novo time</h2>
                    <p className="text-xs text-gray-500">A sigla é gerada com as 3 primeiras letras.</p>
                </div>
            </div>

            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const nome = formData.get('nome') as string;
                    if (nome.trim()) {
                        criarTime({ nome, sigla: nome.substring(0, 3).toUpperCase() });
                        e.currentTarget.reset();
                    }
                }}
            >
                <div>
                    <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Nome do time
                    </label>
                    <input
                        type="text"
                        name="nome"
                        id="nome"
                        className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                        placeholder="Ex.: Flamengo"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 active:scale-[.99]"
                >
                    <span className="text-base leading-none">+</span> Criar time
                </button>
            </form>
        </section>
    );
};