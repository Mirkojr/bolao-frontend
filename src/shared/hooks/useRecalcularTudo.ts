import { useState } from 'react';
import { adminService } from '@/shared/services/admin-service';

export function useRecalcularTudo() {
    const [isLoading, setIsLoading] = useState(false);

    const recalcular = async () => {
        if (!window.confirm('Tem certeza de que deseja recalcular tudo? Esta ação não pode ser desfeita.')) {
            return;
        }

        setIsLoading(true);
        try {
            await adminService.recalcularTudo();
            alert('Recálculo iniciado com sucesso!');
        } catch (error) {
            console.error('Erro ao recalcular tudo:', error);
            alert('Ocorreu um erro ao tentar recalcular tudo. Por favor, tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return { recalcular, isLoading };
}