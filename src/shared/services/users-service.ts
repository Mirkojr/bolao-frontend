import { httpClient } from '@/shared/api/httpClient';
import type { User } from '@/shared/interfaces/user';


export const usersService = {
    getAll:  (): Promise<User> => {
        return httpClient.get<User>('/users');
    },
}