import React from "react";
import { useJogos } from "@/shared/hooks/useJogos";

export const AtualizarPlacar = () => {
    const { todosJogos, updateJogo } = useJogos();
    const handleAtualizarPlacar = (jogoId: string, golsTimeA: number, golsTimeB: number) => {
        updateJogo(jogoId, { gol_a_real: golsTimeA, gol_b_real: golsTimeB });
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Atualizar Placar dos Jogos</h2>
            {todosJogos.map((jogo) => (
                <div key={jogo.id} className="mb-4 p-4 border rounded">
                    <div className="mb-2">
                        <span className="font-semibold">{jogo.timeA?.nome || 'Time A'}</span> vs <span className="font-semibold">{jogo.timeB?.nome || 'Time B'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            defaultValue={jogo.gol_a_real ?? 0}
                            onChange={(e) => handleAtualizarPlacar(String(jogo.id), parseInt(e.target.value), jogo.gol_b_real ?? 0)}
                            className="w-16 p-1 border rounded text-center"
                        />
                        <span className="text-gray-400">x</span>
                        <input
                            type="number"
                            defaultValue={jogo.gol_b_real ?? 0}
                            onChange={(e) => handleAtualizarPlacar(String(jogo.id), jogo.gol_a_real ?? 0, parseInt(e.target.value))}
                            className="w-16 p-1 border rounded text-center"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}