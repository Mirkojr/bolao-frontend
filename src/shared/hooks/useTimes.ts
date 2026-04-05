import { useCallback, useState } from "react"
import type { Time } from "../interfaces/time"
import { timeService } from "../services/time-service";

export const useTimes = () => {

    const [allTeams, setAllTeams] = useState<Time[]>([]);

    const carregarTimes = useCallback(async ()=>{
        try {
            const times = await timeService.getAll();
            setAllTeams(times);
        } catch (error) {
            console.error("Erro ao carregar times.", error)
        }
    }, [])

    const criarTime = useCallback(async (dadosTime: Partial<Time>) => {
        try {
            const novoTime = await timeService.add(dadosTime);
            setAllTeams(prev => [...prev, novoTime]);
        } catch (error) {
            console.error("Erro ao criar time.", error)
        }
    }, [])

    const deletarTime = useCallback(async (timeId: string) => {
        try {
            await timeService.delete(timeId);
            setAllTeams(prev => prev.filter(time => time.id !== timeId));
        } catch (error) {
            console.error("Erro ao deletar time.", error)
        }
    }, [])

    const atualizarTime = useCallback(async (timeId: string, dadosTime: Partial<Time>) => {
        try {
            const timeAtualizado = await timeService.update(timeId, dadosTime);
            setAllTeams(prev => prev.map(time => time.id === timeId ? timeAtualizado : time));
        } catch (error) {
            console.error("Erro ao atualizar time.", error)
        }
    }, [])

    return {
        allTeams,
        setAllTeams,
        carregarTimes, 
        criarTime,
        deletarTime, 
        atualizarTime
    }
}