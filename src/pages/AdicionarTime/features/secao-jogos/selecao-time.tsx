import { useState } from 'react';
import { type Time } from '@/shared/interfaces/time';

interface SelecaoTimeProps {
    label: string; // "Time A" ou "Time B"
    selectedTeam: string | null;
    onSelect: (nome: string) => void;
    times: Time[];
}

export const SelecaoTime = ({ label, selectedTeam, onSelect, times }: SelecaoTimeProps) => {
    const [isSearching, setIsSearching] = useState(false);
    const [filter, setFilter] = useState('');

    const filteredTeams = times.filter((time) =>
        time.nome.toLowerCase().includes(filter.toLowerCase()),
    );

    if (selectedTeam && !isSearching) {
        return (
            <div className="w-full rounded-xl border border-gray-200 bg-white p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {label}
                </p>
                <button
                    type="button"
                    onClick={() => setIsSearching(true)} // Permite trocar o time
                    className="flex w-full items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-left transition hover:bg-blue-100"
                >
                    <span className="text-base font-bold text-blue-900">{selectedTeam}</span>
                    <span className="text-xs font-medium text-blue-500">Trocar</span>
                </button>
            </div>
        );
    }

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>

            {!isSearching && !selectedTeam ? (
                <button
                    type="button"
                    onClick={() => setIsSearching(true)}
                    className="w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                >
                    + Selecionar time
                </button>
            ) : (
                <div className="flex w-full flex-col">
                    <input
                        autoFocus
                        placeholder={`Buscar ${label}...`}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    />

                    <div className="max-h-44 w-full overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
                        {filteredTeams.length > 0 ? (
                            filteredTeams.map((time) => (
                                <button
                                    key={time.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(time.nome);
                                        setIsSearching(false);
                                        setFilter('');
                                    }}
                                    className="block w-full border-b border-gray-100 px-4 py-2.5 text-left text-sm text-gray-700 transition last:border-0 hover:bg-white hover:text-blue-600"
                                >
                                    {time.nome}
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-gray-400">
                                Nenhum time encontrado
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsSearching(false)}
                        className="mt-2 self-center text-xs font-medium text-gray-400 transition hover:text-red-500"
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
};