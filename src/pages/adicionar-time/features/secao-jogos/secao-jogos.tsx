// features/secao-jogos/secao-jogos.tsx
import { AddJogoButton } from  '@/pages/adicionar-time/components/add-jogo-button'

import { JogosList } from './jogos-list';
import ModalGenerico from '@/shared/components/modal/Modal';
import { useState } from 'react';

interface SecaoJogosProps {
    jogos: any[];
    loading: boolean;
    onAddJogo: (timeA: string, timeB: string) => void;
}

export const SecaoJogos = ({ jogos, loading, onAddJogo }: SecaoJogosProps) => {

    const [openModal, setOpenModal] = useState(false);
    
    return (
        <section>
             {/* <AddJogoForm onAdd={onAddJogo} /> */}
             <div className="flex justify-center">

                 <AddJogoButton onClick={() => setOpenModal(!openModal)}/>
             </div>
             <ModalGenerico setModalOpen={setOpenModal} isOpen={openModal}> Funcionando direitinho </ModalGenerico>
             <JogosList jogos={jogos} loading={loading} />
        </section>
    );
};


