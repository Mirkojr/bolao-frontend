import { useRecalcularTudo } from '@/shared/hooks/useRecalcularTudo';

export function RecalcularTudo() {
    const { recalcular, isLoading } = useRecalcularTudo();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Recalcular Tudo</h1>
            
            <p className="text-gray-600 mb-8">
                Esta ação recalculará todos os resultados do sistema. Por favor, tenha certeza de que deseja prosseguir.
            </p>
            
            <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={recalcular}
                disabled={isLoading}
            >
                {isLoading ? 'Recalculando...' : 'Recalcular Tudo'}
            </button>
        </div>
    );
}