export type JogoStatus = "todos" | "agendado" | "finalizado";
export type JogoPeriodo = "todos" | "hoje" | "semana" | "futuros" | "passados" | "sem_data";
export type JogoSort = "proximos" | "data_asc" | "data_desc" | "recentes";

export type JogoFiltros = {
    search: string;
    status: JogoStatus;
    periodo: JogoPeriodo;
    sort: JogoSort;
};

export type JogoCounts = {
    todos: number;
    agendados: number;
    finalizados: number;
    pendentes: number;
};

export const FILTROS_PADRAO: JogoFiltros = {
    search: "",
    status: "todos",
    periodo: "todos",
    sort: "proximos",
};

export const PERIODO_LABEL: Record<JogoPeriodo, string> = {
    todos: "Qualquer data",
    hoje: "Hoje",
    semana: "Próximos 7 dias",
    futuros: "A realizar",
    passados: "Já realizados",
    sem_data: "Sem data definida",
};

export const SORT_LABEL: Record<JogoSort, string> = {
    proximos: "Próximos primeiro",
    data_asc: "Data ↑ (mais antiga)",
    data_desc: "Data ↓ (mais recente)",
    recentes: "Cadastrados por último",
};

/** true se algum filtro além da busca estiver ativo */
export const contarFiltrosAtivos = (f: JogoFiltros) =>
    (f.status !== "todos" ? 1 : 0) +
    (f.periodo !== "todos" ? 1 : 0) +
    (f.sort !== "proximos" ? 1 : 0);