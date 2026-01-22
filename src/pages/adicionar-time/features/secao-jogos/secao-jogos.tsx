// features/secao-jogos/secao-jogos.tsx
import { AddJogoButton } from  '@/pages/adicionar-time/components/add-jogo-button'

import { JogosList } from './jogos-list';
import { Input } from '@/shared/components/input/Input'
import { Card, CardTitle } from  '@/shared/components/card/Card'
import { Button } from  '@/shared/components/button/Button'

import ModalGenerico from '@/shared/components/modal/Modal';

import { useEffect, useState } from 'react';
import { useTimes } from '@/shared/hooks/useTimes';

interface SecaoJogosProps {
    jogos: any[];
    loading: boolean;
    onAddJogo: (timeA: string, timeB: string) => void;
}

export const SecaoJogos = ({ jogos, loading, onAddJogo }: SecaoJogosProps) => {

    const [openModal, setOpenModal] = useState(false);
    
    const {allTeams, carregarTimes} = useTimes();

    useEffect(() => {
        carregarTimes();
    }, [carregarTimes]);

    const [selectingTeamA, setSelectingTeamA] = useState(false);
    const [selectingTeamB, setSelectingTeamB] = useState(false);
    
    const [teamASelected, setTeamASelected] = useState("");
    const [teamBSelected, setTeamBSelected] = useState("");

    const [filterTeamA, setFilterTeamA] = useState("");
    const [filterTeamB, setFilterTeamB] = useState("");

    const filteredTeamsA = allTeams.filter(time => time.nome.toLowerCase().includes(filterTeamA.toLowerCase()));
    const filteredTeamsB = allTeams.filter(time => time.nome.toLowerCase().includes(filterTeamB.toLowerCase()));

    return (
        <section>
             {/* <AddJogoForm onAdd={onAddJogo} /> */}
             <div className="flex justify-center">

                 <AddJogoButton onClick={() => setOpenModal(!openModal)}/>
             </div>

             <ModalGenerico setModalOpen={setOpenModal} isOpen={openModal}> 
                <CardTitle className="text-7xl"> SELEÇÃO DE TIMES </CardTitle>
                <Card className="w-full flex flex-col gap-3"> 
                    {/* TÍTULO FIXO */}
                    <CardTitle>Time A</CardTitle>

                    {selectingTeamA ? (
                        <>
                            <div className="w-full flex flex-col items-center">
            
                                {/* INPUT DE FILTRO  */}
                                <Input 
                                    variant='default' 
                                    inputSize='md' 
                                    placeholder="Buscar time..." 
                                    className="mb-2 w-[80%]"
                                    value={filterTeamA}
                                    onChange={(e) => setFilterTeamA(e.target.value)}
                                />
                                
                                {/* LISTA DE SELEÇÃO */}
                                <div className="w-[80%] max-h-50 overflow-y-auto custom-scrollbar border border-gray-200 rounded-md bg-gray-50 shadow-inner">
                                    {filteredTeamsA.length > 0 ? (
                                        filteredTeamsA.map(time => (
                                            <Button 
                                                key={time.id} 
                                                onClick={() => {
                                                    setSelectingTeamA(false); 
                                                    setTeamASelected(time.nome);
                                                }}
                                                className="w-full justify-start text-left px-4 py-2 hover:bg-white border-b border-gray-100 last:border-0 h-auto text-sm"
                                                variant="ghost"
                                            >
                                                {time.nome}
                                            </Button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-xs text-gray-400">
                                            Nenhum time encontrado
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {/* MOSTRA O NOME LOGO ABAIXO DO TÍTULO */}
                            {teamASelected ? (
                                <Button className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md"
                                        onClick={() => setSelectingTeamA(true)}
                                >
                                    <span className="font-bold text-white text-lg">
                                        {teamASelected}
                                    </span>
                                </Button>
                            ) : (
                                <Button 
                                    onClick={() => setSelectingTeamA(true)} 
                                    variant="ghost"
                                    className="w-full border-dashed"
                                >
                                    + Selecionar Time
                                </Button>
                            )}
                            
                        </div>
                    )}
                </Card>

                <Card className="w-full flex flex-col gap-3"> 
                    {/* TÍTULO FIXO */}
                    <CardTitle>Time B</CardTitle>

                    {selectingTeamB ? (
                        <>
                            <div className="w-full flex flex-col items-center">
                                <Input 
                                    variant='default' 
                                    inputSize='md' 
                                    placeholder="Filtrar time..." 
                                    className="mb-2"
                                    value={filterTeamB}
                                    onChange={(e) => setFilterTeamB(e.target.value)}
                                />
                                
                                {/* LISTA DE SELEÇÃO */}
                                <div className="w-[80%] max-h-50 overflow-y-auto custom-scrollbar border border-gray-200 rounded-md bg-gray-50 shadow-inner">
                                    {filteredTeamsB.length > 0 ? (
                                        filteredTeamsB.map(time => (
                                            <Button 
                                                key={time.id} 
                                                onClick={() => {
                                                    setSelectingTeamB(false); 
                                                    setTeamBSelected(time.nome);
                                                }}
                                                className="w-full justify-start text-left px-4 py-2 hover:bg-white border-b border-gray-100 last:border-0 h-auto text-sm"
                                                variant="ghost"
                                            >
                                                {time.nome}
                                            </Button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-xs text-gray-400">
                                            Nenhum time encontrado
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {/* MOSTRA O NOME LOGO ABAIXO DO TÍTULO */}
                            {teamBSelected ? (
                                <Button className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md"
                                        onClick={() => setSelectingTeamB(true)}
                                >
                                    <span className="font-bold text-white text-lg">
                                        {teamBSelected}
                                    </span>
                                </Button>
                            ) : (
                                <Button 
                                    onClick={() => setSelectingTeamB(true)} 
                                    variant="ghost"
                                    className="w-full border-dashed"
                                >
                                    + Selecionar Time
                                </Button>
                            )}
                            
                        </div>
                    )}
                </Card>
            </ModalGenerico>

             <JogosList jogos={jogos} loading={loading} />
        </section>
    );
};


