import { useEffect, useState } from 'react';
import { API_OFFLINE_EVENT, API_ONLINE_EVENT } from '@/shared/api/httpClient';

/**
 * Faixa global exibida quando a API para de responder.
 * Não precisa de prop: escuta os eventos disparados pelo httpClient.
 */
export function StatusServidor() {
    const [offline, setOffline] = useState(false);
    const [semInternet, setSemInternet] = useState(
        typeof navigator !== 'undefined' && navigator.onLine === false,
    );

    useEffect(() => {
        const cair = () => setOffline(true);
        const voltar = () => setOffline(false);
        const perdeuRede = () => setSemInternet(true);
        const voltouRede = () => setSemInternet(false);

        window.addEventListener(API_OFFLINE_EVENT, cair);
        window.addEventListener(API_ONLINE_EVENT, voltar);
        window.addEventListener('offline', perdeuRede);
        window.addEventListener('online', voltouRede);

        return () => {
            window.removeEventListener(API_OFFLINE_EVENT, cair);
            window.removeEventListener(API_ONLINE_EVENT, voltar);
            window.removeEventListener('offline', perdeuRede);
            window.removeEventListener('online', voltouRede);
        };
    }, []);

    if (!offline && !semInternet) return null;

    const texto = semInternet
        ? 'Você está sem internet. Reconecte para continuar.'
        : 'O servidor não está respondendo. Ele pode estar iniciando — isso leva até 1 minuto.';

    return (
        <div
            role="status"
            className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white"
        >
            <span>⚠️ {texto}</span>
            {!semInternet && (
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-md bg-white/20 px-3 py-1 font-semibold transition hover:bg-white/30"
                >
                    Tentar novamente
                </button>
            )}
        </div>
    );
}