import { httpClient } from '../api/httpClient';

export const adminService = {
    // POST: a operação altera dados, e o httpClient não repete POSTs automaticamente
    recalcularTudo: (): Promise<void> => {
        return httpClient.post<void>('/admin/recalcularPontos', {});
    },
};
