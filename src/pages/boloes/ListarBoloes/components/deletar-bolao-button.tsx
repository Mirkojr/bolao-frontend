import { useState } from 'react';
import { useBoloes } from '@/shared/hooks/useBoloes';

interface DeleteBolaoButtonProps {
    bolaoId: number;
    onDeleted: (id: number) => void;
}

export const DeleteBolaoButton = ({ bolaoId, onDeleted }: DeleteBolaoButtonProps) => {
    const { deletarBolao } = useBoloes();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Tem certeza que deseja deletar este bolão?')) return;

        setIsDeleting(true);
        try {
            await deletarBolao(bolaoId);
            onDeleted(bolaoId);
            alert('Bolão deletado com sucesso!');
        } catch (error: any) {
            alert('Erro ao deletar bolão: ' + (error.message || ''));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Deletar bolão"
            className="group flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-red-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isDeleting ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-5 h-5 transition-transform group-hover:scale-110" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )}
        </button>
    );
};