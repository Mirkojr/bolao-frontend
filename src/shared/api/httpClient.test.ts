import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { httpClient, ApiError, AUTH_LOGOUT_EVENT, API_OFFLINE_EVENT } from './httpClient';

const resposta = (status: number, corpo?: unknown, headers: Record<string, string> = {}) =>
    new Response(corpo === undefined ? null : JSON.stringify(corpo), { status, headers });

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
});

/** Captura o erro de uma promise que deve falhar, avançando os timers no caminho. */
async function erroDe(promessa: Promise<unknown>): Promise<ApiError> {
    const resultado = promessa.then(() => { throw new Error('deveria ter falhado'); }, (e) => e);
    await vi.runAllTimersAsync();
    return resultado as Promise<ApiError>;
}

describe('httpClient', () => {
    it('envia o token salvo e o Content-Type JSON', async () => {
        localStorage.setItem('meu_token', 'abc');
        fetchMock.mockResolvedValue(resposta(200, { ok: true }));

        await expect(httpClient.post('/x', { a: 1 })).resolves.toEqual({ ok: true });

        const [, init] = fetchMock.mock.calls[0];
        const headers = new Headers(init?.headers);
        expect(headers.get('Authorization')).toBe('Bearer abc');
        expect(headers.get('Content-Type')).toBe('application/json');
        expect(init?.body).toBe('{"a":1}');
    });

    it('repete um GET quando o servidor responde 503 e devolve o resultado', async () => {
        fetchMock
            .mockResolvedValueOnce(resposta(503))
            .mockResolvedValueOnce(resposta(200, [1, 2]));

        const promessa = httpClient.get('/jogos');
        await vi.runAllTimersAsync();

        await expect(promessa).resolves.toEqual([1, 2]);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('não repete um POST (para não duplicar escrita)', async () => {
        fetchMock.mockResolvedValue(resposta(503, { message: 'fora do ar' }));

        const erro = await erroDe(httpClient.post('/admin/recalcularPontos', {}));

        expect(erro).toBeInstanceOf(ApiError);
        expect(erro.status).toBe(503);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('falha de rede vira erro de conexão e avisa que a API está offline', async () => {
        const offline = vi.fn();
        window.addEventListener(API_OFFLINE_EVENT, offline);
        fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

        const erro = await erroDe(httpClient.get('/boloes'));

        expect(erro.isConexao).toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(2); // tentou de novo
        expect(offline).toHaveBeenCalled();
        window.removeEventListener(API_OFFLINE_EVENT, offline);
    });

    it('timeout vira erro 408', async () => {
        fetchMock.mockImplementation((_url, init) => new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => reject(new DOMException('abortado', 'AbortError')));
        }));

        const erro = await erroDe(httpClient.post('/x', {}, { timeout: 1000 }));

        expect(erro.status).toBe(408);
    });

    it('401 com sessão ativa desloga; 401 no login só repassa a mensagem', async () => {
        const logout = vi.fn();
        window.addEventListener(AUTH_LOGOUT_EVENT, logout);

        localStorage.setItem('meu_token', 'expirado');
        fetchMock.mockResolvedValueOnce(resposta(401, { message: 'Token inválido' }));
        const sessao = await erroDe(httpClient.get('/boloes'));
        expect(sessao.message).toBe('Sua sessão expirou. Faça login novamente.');
        expect(logout).toHaveBeenCalledTimes(1);

        fetchMock.mockResolvedValueOnce(resposta(401, { message: 'Credenciais inválidas.' }));
        const login = await erroDe(httpClient.post('/auth/login', {}));
        expect(login.message).toBe('Credenciais inválidas.');
        expect(logout).toHaveBeenCalledTimes(1);

        window.removeEventListener(AUTH_LOGOUT_EVENT, logout);
    });

    it('403 e 429 trazem mensagens amigáveis', async () => {
        fetchMock.mockResolvedValueOnce(resposta(403, { message: 'Você não tem acesso a este bolão.' }));
        expect((await erroDe(httpClient.get('/boloes/1'))).message).toBe('Você não tem acesso a este bolão.');

        fetchMock.mockResolvedValueOnce(resposta(429, { retryAfter: 30 }, { 'RateLimit-Reset': '42' }));
        const limite = await erroDe(httpClient.post('/x', {}));
        expect(limite.status).toBe(429);
        expect(limite.message).toBe('Muitas requisições. Aguarde 42s e tente novamente.');
    });

    it('204 devolve null', async () => {
        fetchMock.mockResolvedValue(resposta(204));
        await expect(httpClient.delete('/jogos/1')).resolves.toBeNull();
    });
});
