import { SecaoJogos } from './features/secao-jogos/secao-jogos'
import { useJogos } from "@/shared/hooks/useJogos";

export const AdicionarTimePage = () => {

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