import { useEffect, useState } from "react";
import { BottomSheetModal } from "@/shared/components/BottomSheetModal";
import { Button } from "@/shared/components/Button";
import {
    atalhosDeData, HORARIOS_COMUNS, isoParaPartes, partesParaIso, rotuloData,
} from "@/shared/utils/data-jogo";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    /** ISO atual (ou vazio) */
    value?: string | null;
    /** Retorna ISO, ou "" quando o usuário escolhe "sem data" */
    onConfirm: (iso: string) => void;
};

const Chip = ({
    ativo, onClick, children, sub,
}: { ativo: boolean; onClick: () => void; children: React.ReactNode; sub?: string }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex min-h-[52px] flex-col items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition active:scale-95
            ${ativo
                ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300"}`}
    >
        <span className="whitespace-nowrap">{children}</span>
        {sub && <span className={`text-[10px] font-normal ${ativo ? "text-indigo-100" : "text-gray-400"}`}>{sub}</span>}
    </button>
);

export const DateTimePickerSheet = ({ isOpen, onClose, value, onConfirm }: Props) => {
    const [data, setData] = useState("");
    const [hora, setHora] = useState("");
    const atalhos = atalhosDeData();

    useEffect(() => {
        if (!isOpen) return;
        const { data: d, hora: h } = isoParaPartes(value);
        setData(d);
        setHora(h === "00:00" ? "" : h);
    }, [isOpen, value]);

    const preview = data
        ? `${rotuloData(data)}${hora ? ` às ${hora}` : " · horário a definir"}`
        : "Nenhuma data escolhida";

    return (
        <BottomSheetModal
            isOpen={isOpen}
            onClose={onClose}
            title="Data e hora da partida"
            layer={2}
            footer={
                <div className="flex flex-col gap-2">
                    <Button
                        variant="success"
                        disabled={!data}
                        onClick={() => { onConfirm(partesParaIso(data, hora)); onClose(); }}
                    >
                        {data ? "Confirmar" : "Escolha uma data"}
                    </Button>
                    <Button variant="ghost"  className="text-gray-500 w-full"
                        onClick={() => { onConfirm(""); onClose(); }}>
                        Deixar sem data definida
                    </Button>
                </div>
            }
        >
            {/* Preview do que será salvo */}
            <div className={`mb-5 rounded-xl px-4 py-3 text-center text-sm font-semibold ${
                data ? "bg-indigo-50 text-indigo-800" : "bg-gray-50 text-gray-400"
            }`}>
                {preview}
            </div>

            {/* DIA */}
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Dia</p>
            <div className="grid grid-cols-3 gap-2">
                {atalhos.map((a) => (
                    <Chip key={a.data} ativo={data === a.data} sub={a.sub} onClick={() => setData(a.data)}>
                        {a.label}
                    </Chip>
                ))}
            </div>

            <div className="mt-3">
                <label className="mb-1 block text-xs text-gray-400">Outra data</label>
                <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:bg-white"
                />
            </div>

            {/* HORÁRIO */}
            <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-gray-500">
                Horário <span className="font-normal normal-case text-gray-400">(opcional)</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
                {HORARIOS_COMUNS.map((h) => (
                    <Chip key={h} ativo={hora === h} onClick={() => setHora(hora === h ? "" : h)}>
                        {h}
                    </Chip>
                ))}
            </div>

            <div className="mt-3 flex items-end gap-2">
                <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-400">Outro horário</label>
                    <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                </div>
                {hora && (
                    <button type="button" onClick={() => setHora("")}
                        className="h-12 shrink-0 rounded-xl px-3 text-xs font-medium text-gray-500 hover:bg-gray-100">
                        Limpar hora
                    </button>
                )}
            </div>
        </BottomSheetModal>
    );
};