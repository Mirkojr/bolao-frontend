// features/jogos/components/secao-jogos.tsx
import { useState } from 'react';
import { AddJogoButton } from '@/pages/AdicionarTime/components/add-jogo-button';
import { JogosList } from './jogos-list';
import { ModalNovoJogo } from './modal-novo-jogo';
import { ModalAtualizarPlacar } from './modal-atualizar-placar';

import type { Jogo } from '@/shared/interfaces/jogo';

import type { StatusFilter } from '@/shared/hooks/useJogos';
import type { OrdemFilter } from '@/shared/hooks/useJogos';

interface SecaoJogosProps {
    jogos: Jogo[];
    loading: boolean;
    onAddJogo: (timeA: string, timeB: string) => void;
    onUpdateJogo: (jogoId: string, dadosJogo: Partial<Jogo>) => void;
    filtros: {
        status: StatusFilter;
        setStatus: (status: StatusFilter) => void;
        data: string;
        setData: (data: string) => void;
        ordem: OrdemFilter,
        setOrdem: (ordem: OrdemFilter) => void;
    };
}

export const SecaoJogos = ({ jogos, loading, onAddJogo, onUpdateJogo, filtros}: SecaoJogosProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [jogoSelecionado, setJogoSelecionado] = useState<Jogo | null>(null);
    const [openModalPlacar, setOpenModalPlacar] = useState(false);

    const inputClasses = "bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm cursor-pointer";

    const handleJogoClick = (jogo: Jogo) => {
        setJogoSelecionado(jogo);
        setOpenModalPlacar(true);
    };

    const handleSavePlacar = (jogoId: string, golA: number, golB: number) => {
        onUpdateJogo(jogoId, { gol_a_real: golA, gol_b_real: golB, status: 'FINALIZADO' });
    };

    return (
        <section>
            <div className="flex justify-center mb-6">
                <AddJogoButton onClick={() => setOpenModal(true)} />
            </div>

            {/* Modal */}
            <ModalNovoJogo 
                isOpen={openModal} 
                setIsOpen={setOpenModal} 
                onConfirm={onAddJogo} 
            />

            <ModalAtualizarPlacar
                isOpen={openModalPlacar}
                onClose={() => setOpenModalPlacar(false)}
                jogo={jogoSelecionado}
                onSave={handleSavePlacar}
            />

            {/* BARRA DE FILTROS */}
            <div className="flex flex-wrap gap-4 mb-6 justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                
                {/* Filtro de Status */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1 ml-1 font-medium">Status</label>
                    <select 
                        value={filtros.status} 
                        onChange={(e) => filtros.setStatus(e.target.value as StatusFilter)}
                        className={inputClasses}
                    >
                        <option value="todos">Todos</option>
                        <option value="agendado">Agendados</option>
                        <option value="finalizado">Finalizados</option>
                    </select>
                </div>

                {/* Ordenação (Mais Recentes) */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1 ml-1 font-medium">Ordem</label>
                    <select 
                        value={filtros.ordem}
                        onChange={(e) => filtros.setOrdem(e.target.value as OrdemFilter)}
                        className={`${inputClasses} min-w-35`}
                    >
                        <option value="decrescente">⬇️ Mais Recentes</option>
                        <option value="crescente">⬆️ Mais Antigos</option>
                    </select>
                </div>

            </div>

            <JogosList jogos={jogos} loading={loading} onJogoClick={handleJogoClick} />
        </section>
    );
};