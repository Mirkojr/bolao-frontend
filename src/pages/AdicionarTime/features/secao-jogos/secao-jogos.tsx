// features/jogos/components/secao-jogos.tsx
import { useState } from 'react';
import { AddJogoButton } from '@/pages/AdicionarTime/components/add-jogo-button';
import { JogosList } from './jogos-list';
import { ModalNovoJogo } from './modal-novo-jogo';
import { ModalAtualizarPlacar } from './modal-atualizar-placar';

import type { Jogo } from '@/shared/interfaces/jogo';
import type { StatusFilter, OrdemFilter } from '@/shared/hooks/useJogos';

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
        ordem: OrdemFilter;
        setOrdem: (ordem: OrdemFilter) => void;
    };
}

export const SecaoJogos = ({ jogos, loading, onAddJogo, onUpdateJogo, filtros }: SecaoJogosProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [jogoSelecionado, setJogoSelecionado] = useState<Jogo | null>(null);
    const [openModalPlacar, setOpenModalPlacar] = useState(false);

    const selectClasses =
        'w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30';

    const handleJogoClick = (jogo: Jogo) => {
        setJogoSelecionado(jogo);
        setOpenModalPlacar(true);
    };

    const handleSavePlacar = (jogoId: string, golA: number, golB: number) => {
        onUpdateJogo(jogoId, { gol_a_real: golA, gol_b_real: golB, status: 'FINALIZADO' });
    };

    return (
        <section className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            {/* Cabeçalho + ação */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Jogos</h2>
                    <p className="text-xs text-gray-500">
                        Crie confrontos e clique em um jogo para atualizar o placar.
                    </p>
                </div>
                <div className="shrink-0">
                    <AddJogoButton onClick={() => setOpenModal(true)} />
                </div>
            </div>

            {/* Modais */}
            <ModalNovoJogo isOpen={openModal} setIsOpen={setOpenModal} onConfirm={onAddJogo} />
            <ModalAtualizarPlacar
                isOpen={openModalPlacar}
                onClose={() => setOpenModalPlacar(false)}
                jogo={jogoSelecionado}
                onSave={handleSavePlacar}
            />

            {/* Barra de filtros */}
            <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2">
                <div className="flex flex-col">
                    <label className="mb-1 ml-0.5 text-xs font-medium text-gray-500">Status</label>
                    <select
                        value={filtros.status}
                        onChange={(e) => filtros.setStatus(e.target.value as StatusFilter)}
                        className={selectClasses}
                    >
                        <option value="todos">Todos</option>
                        <option value="agendado">Agendados</option>
                        <option value="finalizado">Finalizados</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 ml-0.5 text-xs font-medium text-gray-500">Ordem</label>
                    <select
                        value={filtros.ordem}
                        onChange={(e) => filtros.setOrdem(e.target.value as OrdemFilter)}
                        className={selectClasses}
                    >
                        <option value="decrescente">⬇️ Mais recentes</option>
                        <option value="crescente">⬆️ Mais antigos</option>
                    </select>
                </div>
            </div>

            <JogosList jogos={jogos} loading={loading} onJogoClick={handleJogoClick} />
        </section>
    );
};