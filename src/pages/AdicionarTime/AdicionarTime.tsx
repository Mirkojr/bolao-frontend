import { useAuth } from '@/context/AuthContext';
import { SecaoJogos } from './features/secao-jogos/secao-jogos'
import { useJogos } from "@/shared/hooks/useJogos";

export const AdicionarTimePage = () => {

    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return <div className="p-6 text-red-500">Acesso negado. Por favor, faça login como administrador.</div>;
    }
    
    const { 
        todosJogos, 
        addJogo, 
        loading: loadingJogos,
        filtros
     } = useJogos();

    return (
        <>
            <div className={"pt-5"}>
                <SecaoJogos
                    jogos= {todosJogos}
                    loading={loadingJogos}
                    onAddJogo={addJogo}
                    filtros={filtros}
                />
            </div>
        </>
    )
}