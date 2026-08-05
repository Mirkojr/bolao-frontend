const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

export const AUTH_LOGOUT_EVENT = 'auth:logout';
export const API_OFFLINE_EVENT = 'api:offline';
export const API_ONLINE_EVENT = 'api:online';

/** Render free hiberna após 15min: o primeiro acesso pode levar ~50s */
const TIMEOUT_PADRAO = 60_000;
const TENTATIVAS = 2;
const ESPERA_ENTRE_TENTATIVAS = 2_000;

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

    /** true quando o problema é de conexão/servidor, não do que o usuário fez */
    get isConexao() {
        return this.status === 0 || this.status === 408 || this.status >= 502;
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

/** Rotas onde um 401 significa "credencial errada", não "sessão expirada" */
const isRotaDeAutenticacao = (endpoint: string) => endpoint.startsWith('/auth');

const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
    responseType?: 'json' | 'blob';
    /** ms até desistir da requisição (padrão 60s) */
    timeout?: number;
    /** desliga o retry automático (ex.: em POST que não pode duplicar) */
    semRetry?: boolean;
}

/** Traduz falhas de conexão para linguagem de gente */
function erroDeConexao(motivo: 'offline' | 'timeout' | 'servidor'): ApiError {
    if (motivo === 'offline') {
        return new ApiError(0, 'Você está sem conexão com a internet. Verifique sua rede e tente novamente.');
    }
    if (motivo === 'timeout') {
        return new ApiError(408, 'O servidor demorou demais para responder. Tente novamente em instantes.');
    }
    return new ApiError(
        503,
        'Não foi possível falar com o servidor. Ele pode estar iniciando — tente novamente em alguns segundos.',
    );
}

async function request<T>(
    endpoint: string,
    method: string,
    body?: unknown,
    options?: FetchOptions,
): Promise<T> {
    const isFormData = body instanceof FormData;
    const timeout = options?.timeout ?? TIMEOUT_PADRAO;
    // GET/DELETE são idempotentes; POST/PUT só repetem se explicitamente permitido
    const podeRepetir = !options?.semRetry && (method === 'GET' || method === 'DELETE');
    const maxTentativas = podeRepetir ? TENTATIVAS : 1;

    let ultimoErro: ApiError | null = null;

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            ultimoErro = erroDeConexao('offline');
            break;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                method,
                headers: getHeaders(options?.headers, body),
                body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
                signal: controller.signal,
            });

            // 502/503/504 = o Render ainda está subindo o container
            if ([502, 503, 504].includes(response.status) && tentativa < maxTentativas) {
                ultimoErro = erroDeConexao('servidor');
                await dormir(ESPERA_ENTRE_TENTATIVAS);
                continue;
            }

            window.dispatchEvent(new Event(API_ONLINE_EVENT));
            return await handleResponse(response, options?.responseType, endpoint);

        } catch (erro: any) {
            // erros de regra de negócio sobem direto, sem retry
            if (erro instanceof ApiError) throw erro;

            ultimoErro = erro?.name === 'AbortError'
                ? erroDeConexao('timeout')
                : erroDeConexao('servidor');

            if (tentativa < maxTentativas) await dormir(ESPERA_ENTRE_TENTATIVAS);

        } finally {
            clearTimeout(timer);
        }
    }

    window.dispatchEvent(new Event(API_OFFLINE_EVENT));
    throw ultimoErro ?? erroDeConexao('servidor');
}

export const httpClient = {
    get:    <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, 'GET', undefined, options),
    delete: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, 'DELETE', undefined, options),
    post:   <T>(endpoint: string, body: unknown, options?: FetchOptions) => request<T>(endpoint, 'POST', body, options),
    put:    <T>(endpoint: string, body: unknown, options?: FetchOptions) => request<T>(endpoint, 'PUT', body, options),
};