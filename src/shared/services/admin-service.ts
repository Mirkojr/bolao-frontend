import { httpClient } from '../api/httpClient';

export const adminService = {
    recalcularTudo: (): Promise<void> => {
        return httpClient.get<void>('/admin/recalcularPontos', {});
    },
};