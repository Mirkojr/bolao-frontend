import { useAuth } from '@/context/AuthContext';
import { SecaoJogos } from './features/secao-jogos/secao-jogos'
import { useJogos } from "@/shared/hooks/useJogos";
import { CriarTime } from './features/secao-jogos/criar-time';

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
            <div className={"flex flex-col items-center gap-8 p-6"}>
                <CriarTime/>
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