import { useEffect, useState } from "react";
import type { Jogo } from "@/shared/interfaces/jogo";
import { jogosService } from "@/shared/services/jogos-service";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Pagination } from "@/shared/components/Pagination";

interface AdicionarJogosModalProps {
    isOpen: boolean;
    onClose: () => void;
    jogosNoBolao: Jogo[];
    onAdd: (jogoId: string) => Promise<void>;
    onCriarNovo: () => void;
    reloadToken?: number; // muda quando um jogo novo é criado, p/ forçar recarregar
}

const LIMIT = 6;

export const AdicionarJogosModal = ({
    isOpen, onClose, jogosNoBolao, onAdd, onCriarNovo, reloadToken = 0,
}: AdicionarJogosModalProps) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [addingId, setAddingId] = useState<number | null>(null);

    const idsNoBolao = new Set(jogosNoBolao.map((j) => j.id));

    // Debounce da busca -> volta pra página 1
    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => setPage(1), 400);
        return () => clearTimeout(t);
    }, [search, isOpen]);

    // Carrega jogos paginados
    useEffect(() => {
        if (!isOpen) return;
        let ativo = true;
        setLoading(true);
        jogosService
            .getPaginated({ page, limit: LIMIT, search })
            .then((res) => {
                if (!ativo) return;
                setJogos(res.data);
                setTotalPages(res.pagination.totalPages);
            })
            .catch((err) => console.error("Erro ao buscar jogos:", err))
            .finally(() => { if (ativo) setLoading(false); });
        return () => { ativo = false; };
    }, [page, search, isOpen, reloadToken]);

    const handleAdd = async (jogoId: number) => {
        setAddingId(jogoId);
        try {
            await onAdd(String(jogoId));
        } finally {
            setAddingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-5">
                    <h2 className="text-lg font-semibold text-gray-800">Adicionar jogos ao bolão</h2>
                    <button onClick={onClose} aria-label="Fechar"
                        className="text-gray-400 hover:text-red-500 transition-colors text-xl leading-none">✕</button>
                </div>

                {/* Busca + criar */}
                <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-gray-100">
                    <Input fullWidth placeholder="Buscar por time (ex: Flamengo)..."
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Button variant="success" onClick={onCriarNovo} className="whitespace-nowrap">
                        + Criar novo jogo
                    </Button>
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto p-5">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Carregando jogos...</p>
                    ) : jogos.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            Nenhum jogo encontrado{search ? ` para "${search}"` : ""}.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {jogos.map((jogo) => {
                                const jaAdicionado = idsNoBolao.has(jogo.id);
                                const timeA = jogo.timeA?.nome || "Time A";
                                const timeB = jogo.timeB?.nome || "Time B";
                                const data = jogo.data_jogo
                                    ? new Date(jogo.data_jogo).toLocaleString("pt-BR", {
                                          day: "2-digit", month: "2-digit", year: "numeric",
                                          hour: "2-digit", minute: "2-digit",
                                      })
                                    : "Data a definir";

                                return (
                                    <li key={jogo.id}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50/40 transition-colors">
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 truncate">
                                                {timeA} <span className="text-gray-400">vs</span> {timeB}
                                            </p>
                                            <p className="text-xs text-gray-500">{data}</p>
                                        </div>
                                        <Button size="sm"
                                            variant={jaAdicionado ? "secondary" : "primary"}
                                            disabled={jaAdicionado || addingId === jogo.id}
                                            onClick={() => handleAdd(jogo.id)}>
                                            {jaAdicionado ? "Adicionado" : addingId === jogo.id ? "Adicionando..." : "Adicionar"}
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Paginação */}
                <div className="border-t border-gray-100 p-4">
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
            </div>
        </div>
    );
};