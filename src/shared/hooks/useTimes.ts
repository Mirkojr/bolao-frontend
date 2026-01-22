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

    return {
        allTeams,
        setAllTeams,
        carregarTimes
    }
}