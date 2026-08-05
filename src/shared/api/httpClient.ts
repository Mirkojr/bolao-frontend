const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
export const AUTH_LOGOUT_EVENT = 'auth:logout';

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

const getHeaders = (customHeaders?: HeadersInit, body?: unknown) => {
    const headers = new Headers(customHeaders);
    const token = localStorage.getItem('meu_token');

    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (!(body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    return headers;
};

const isRotaDeAutenticacao = (endpoint: string) => endpoint.startsWith('/auth');

async function handleResponse(
    response: Response,
    responseType: 'json' | 'blob' = 'json',
    endpoint = '',
) {
    if (response.status === 401) {
        const dados = await response.json().catch(() => null);
        const tinhaToken = !!localStorage.getItem('meu_token');

        // Só é sessão expirada se o usuário JÁ estava autenticado e a chamada
        // não era a própria tentativa de login.
        if (tinhaToken && !isRotaDeAutenticacao(endpoint)) {
            window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
            throw new ApiError(401, 'Sua sessão expirou. Faça login novamente.', dados);
        }

        // Credencial inválida: preserva a mensagem do backend e NÃO desloga.
        throw new ApiError(401, dados?.message || 'E-mail ou senha inválidos.', dados);
    }

    if (response.status === 403) {
        const dados = await response.json().catch(() => null);
        throw new ApiError(403, dados?.message || 'Você não tem permissão para essa ação.', dados);
    }

    if (response.status === 429) {
        const dados = await response.json().catch(() => null);
        const espera = Number(response.headers.get('RateLimit-Reset') ?? dados?.retryAfter ?? 60);
        throw new ApiError(
            429,
            `Muitas requisições. Aguarde ${espera}s e tente novamente.`,
            { ...dados, retryAfter: espera },
        );
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(response.status, errorData?.message || 'Erro na requisição', errorData);
    }

    if (response.status === 204) return null;

    // Se for blob, retorna o blob. Se não, mantém o comportamento padrão de json.
    if (responseType === 'blob') {
        return response.blob();
    }

    return response.json();
}


// Estendemos as opções para incluir o responseType opcional
interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
    responseType?: 'json' | 'blob';
}

async function request<T>(endpoint: string, method: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const isFormData = body instanceof FormData;
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        method,
        headers: getHeaders(options?.headers, body),
        body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
    });

    return handleResponse(response, options?.responseType);
}

export const httpClient = {
    get:    <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, 'GET', undefined, options),
    delete: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, 'DELETE', undefined, options),
    post:   <T>(endpoint: string, body: unknown, options?: FetchOptions) => request<T>(endpoint, 'POST', body, options),
    put:    <T>(endpoint: string, body: unknown, options?: FetchOptions) => request<T>(endpoint, 'PUT', body, options),
};