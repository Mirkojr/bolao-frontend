import { useState } from 'react';
import { Input } from '@/shared/components/Input';
import { Card, CardTitle } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';

import { type Time } from '@/shared/interfaces/time';

interface SelecaoTimeProps{
    label: string; // "Time A" ou "Time B"
    selectedTeam: string | null;
    onSelect: (nome: string) => void;
    times: Time[];
}

export const SelecaoTime = ({label, selectedTeam, onSelect, times} : SelecaoTimeProps) =>{
    const [isSearching, setIsSearching] = useState(false);
    const [filter, setFilter] = useState("");

    const filteredTeams = times.filter(time => 
        time.nome.toLowerCase().includes(filter.toLowerCase())
    );

    if (selectedTeam && !isSearching) {
        return (
            <Card className='w-full flex flex-col gap-3'>
                <CardTitle>{label}</CardTitle>
                <Button 
                    className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md"
                    onClick={() => setIsSearching(true)} // Permite trocar o time
                >
                    <span className="font-bold text-blue-900 text-lg">{selectedTeam}</span>
                    <span className="text-xs text-blue-400">Trocar</span>
                </Button>
            </Card>
        );
    }

    return (
        <Card className="w-full flex flex-col gap-3">
            <CardTitle>{label}</CardTitle>
            
            {!isSearching && !selectedTeam ? (
                <Button 
                    onClick={() => setIsSearching(true)} 
                    variant="ghost" 
                    className="w-full border-dashed"
                >
                    + Selecionar Time
                </Button>
            ) : (
                <div className="w-full flex flex-col items-center">
                    <Input 
                        variant='default' inputSize='md' 
                        placeholder={`Buscar ${label}...`} 
                        className="mb-2 w-full"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        autoFocus // Ajuda na UX
                    />
                    
                    <div className="w-full max-h-40 overflow-y-auto custom-scrollbar border border-gray-200 rounded-md bg-gray-50 shadow-inner">
                        {filteredTeams.length > 0 ? (
                            filteredTeams.map(time => (
                                <Button 
                                    key={time.id} 
                                    onClick={() => {
                                        onSelect(time.nome);
                                        setIsSearching(false);
                                        setFilter("");
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
                    {/* Botão para cancelar a busca */}
                    <Button variant="ghost" className="mt-2 text-xs text-red-400" onClick={() => setIsSearching(false)}>
                        Cancelar
                    </Button>
                </div>
            )}
        </Card>
    );
}