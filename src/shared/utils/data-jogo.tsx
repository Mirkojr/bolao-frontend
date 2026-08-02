/** Utilidades de data no fuso local (nada de UTC quebrando o dia). */

const pad = (n: number) => String(n).padStart(2, "0");

/** Date -> "yyyy-MM-dd" (local) */
export const paraInputDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** ISO -> { data: "yyyy-MM-dd", hora: "HH:mm" } (local) */
export const isoParaPartes = (iso?: string | null): { data: string; hora: string } => {
    if (!iso) return { data: "", hora: "" };
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { data: "", hora: "" };
    return { data: paraInputDate(d), hora: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
};

/** { data, hora } -> ISO (ou "" se não houver data) */
export const partesParaIso = (data: string, hora: string): string => {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-").map(Number);
    const [h, m] = (hora || "00:00").split(":").map(Number);
    return new Date(ano, mes - 1, dia, h || 0, m || 0).toISOString();
};

/** Ex: "sáb, 02/08" / "Hoje" / "Amanhã" */
export const rotuloData = (data: string): string => {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-").map(Number);
    const d = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const diff = Math.round(
        (new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() -
            new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime()) / 86400000
    );
    if (diff === 0) return "Hoje";
    if (diff === 1) return "Amanhã";
    if (diff === -1) return "Ontem";
    return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
};

/** Rótulo completo para exibir no card: "sáb, 02/08/2026 às 21:30" */
export const rotuloDataHora = (iso?: string | null): string => {
    if (!iso) return "Data a definir";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Data a definir";
    const dataStr = d.toLocaleDateString("pt-BR", {
        weekday: "short", day: "2-digit", month: "2-digit", year: "numeric",
    });
    const semHora = d.getHours() === 0 && d.getMinutes() === 0;
    return semHora ? `${dataStr} · horário a definir`
                   : `${dataStr} às ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** Atalhos: hoje, amanhã, depois de amanhã, próx. sábado, próx. domingo */
export const atalhosDeData = (): Array<{ label: string; data: string; sub: string }> => {
    const hoje = new Date();
    const mk = (offset: number) => {
        const d = new Date(hoje);
        d.setDate(d.getDate() + offset);
        return d;
    };
    const proximoDiaSemana = (alvo: number) => {
        const d = new Date(hoje);
        const delta = (alvo - d.getDay() + 7) || 7; // sempre o próximo, nunca hoje
        d.setDate(d.getDate() + delta);
        return d;
    };

    const itens = [
        { label: "Hoje", d: mk(0) },
        { label: "Amanhã", d: mk(1) },
        { label: mk(2).toLocaleDateString("pt-BR", { weekday: "short" }), d: mk(2) },
        { label: "Sábado", d: proximoDiaSemana(6) },
        { label: "Domingo", d: proximoDiaSemana(0) },
    ];

    // remove datas repetidas (ex: hoje é quinta e "depois de amanhã" = sábado)
    const vistos = new Set<string>();
    return itens
        .map((i) => ({
            label: i.label.charAt(0).toUpperCase() + i.label.slice(1).replace(".", ""),
            data: paraInputDate(i.d),
            sub: i.d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        }))
        .filter((i) => (vistos.has(i.data) ? false : (vistos.add(i.data), true)));
};

/** Horários mais comuns de partida no Brasil */
export const HORARIOS_COMUNS = ["16:00", "18:30", "19:00", "20:00", "21:30", "21:45"];