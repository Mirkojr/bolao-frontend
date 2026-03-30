const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
export const AUTH_LOGOUT_EVENT = 'auth:logout';

// Classe de erro personalizada para erros de API
export class ApiError extends Error {
    status: number;
    message: string;
    data?: any;

    constructor(status: number, message: string, data?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

// Função para construir os headers, incluindo o token de autenticação se disponível
const getHeaders = (customHeaders?: HeadersInit, body?: unknown) => {
    const headers = new Headers(customHeaders);
    const token = localStorage.getItem('meu_token');

    // Se houver um token e o header Authorization ainda não estiver presente, adiciona o token
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Se o body não for FormData e o header Content-Type ainda não estiver presente, define como application/json
    if (!(body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    return headers;
};

// Toda resposta do backend passa por aqui
async function handleResponse(response: Response) {
    if (response.status === 401) {
        window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
        throw new ApiError(401, 'Sessão expirada');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(response.status, errorData?.message || 'Erro na requisição', errorData);
    }

    return response.status === 204 ? null : response.json();
}

interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {}


// Função genérica para fazer requisições HTTP
async function request<T>(endpoint: string, method: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const isFormData = body instanceof FormData;
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        method,
        headers: getHeaders(options?.headers, body),
        body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
    });

    return handleResponse(response);
}

export const httpClient = {
    get:    <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, 'GET', undefined, options),
    delete: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, 'DELETE', undefined, options),
    post:   <T>(endpoint: string, body: unknown, options?: FetchOptions) => request<T>(endpoint, 'POST', body, options),
    put:    <T>(endpoint: string, body: unknown, options?: FetchOptions) => request<T>(endpoint, 'PUT', body, options),
};