import { httpClient } from '../api/httpClient';
import type { User } from '../interfaces/user';


export default {
    getAll: async (): Promise<User> => {
        return httpClient.get<User>('/users');
    }
}