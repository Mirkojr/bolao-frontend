import { httpClient } from "../api/httpClient"
import { type Time } from "../interfaces/time"

export const timeService = {
    getAll: (): Promise<Time[]> => {
        return httpClient.get<Time[]>('/times');
    },

    add: (dadosTime: Partial<Time>): Promise<Time> => {
        return httpClient.post<Time>('/times', dadosTime);
    },

    delete: (timeId: string): Promise<void> => {
        return httpClient.delete(`/times/${timeId}`);
    }
}