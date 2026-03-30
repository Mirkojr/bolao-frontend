import { httpClient } from "../api/httpClient"
import { type Time } from "../interfaces/time"

export const timeService = {
    getAll: (): Promise<Time[]> => {
        return httpClient.get<Time[]>('/times');
    }
}