// features/secao-jogos/secao-jogos.tsx
import { AddJogoForm } from './add-jogo-form'; 
import { JogosList } from './jogos-list';
// REMOVA: import { useJogos } from '../../hooks/useJogos';

interface SecaoJogosProps {
    jogos: any[];
    loading: boolean;
    onAddJogo: (timeA: string, timeB: string) => void;
}

export const SecaoJogos = ({ jogos, loading, onAddJogo }: SecaoJogosProps) => {
    
    return (
        <section>
             <AddJogoForm onAdd={onAddJogo} />
             
             <JogosList jogos={jogos} loading={loading} />
        </section>
    );
};