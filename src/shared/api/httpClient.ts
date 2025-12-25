const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const AUTH_LOGOUT_EVENT = 'auth:logout';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('meu_token')}`,
});


async function handleResponse(response: Response) {
    if (response.status === 401) {
        window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
        throw new Error('Sessão expirada');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro na requisição API');
    }

    return response.status !== 204 ? response.json() : null;
}

export const httpClient = {
    get: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    post: async <T>(endpoint: string, body: unknown): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    put: async <T>(endpoint: string, body: unknown): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    }
};