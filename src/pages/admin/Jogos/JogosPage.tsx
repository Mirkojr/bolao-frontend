import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Jogo } from "@/shared/interfaces/jogo";
import { useJogosPaginado } from "@/shared/hooks/useJogosPaginado";
import { useTimes } from "@/shared/hooks/useTimes";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Pagination } from "@/shared/components/Pagination";
import { JogoFormModal } from "./components/JogoFormModal";

export const JogosPage = () => {
    const { isAuthenticated } = useAuth();
    const {
        jogos, loading, page, setPage, totalPages, total,
        search, setSearch, criarJogo, atualizarJogo, deletarJogo,
    } = useJogosPaginado();

    const { allTeams, carregarTimes } = useTimes();

    const [modalOpen, setModalOpen] = useState(false);
    const [jogoEditando, setJogoEditando] = useState<Jogo | null>(null);

    useEffect(() => { carregarTimes(); }, [carregarTimes]);

    if (!isAuthenticated) {
        return <div className="p-6 text-red-500">Acesso negado. Faça login como administrador.</div>;
    }

    const abrirCriar = () => { setJogoEditando(null); setModalOpen(true); };
    const abrirEditar = (j: Jogo) => { setJogoEditando(j); setModalOpen(true); };

    const handleSubmit = async (dados: { time_a_id: number; time_b_id: number; data_jogo: string }) => {
        if (jogoEditando) await atualizarJogo(String(jogoEditando.id), dados);
        else await criarJogo(dados);
    };

    const handleDelete = async (j: Jogo) => {
        const nome = `${j.timeA?.nome ?? "Time A"} vs ${j.timeB?.nome ?? "Time B"}`;
        if (confirm(`Excluir o jogo "${nome}"? Essa ação não pode ser desfeita.`)) {
            await deletarJogo(String(j.id));
        }
    };

    const fmtData = (iso?: string) =>
        iso ? new Date(iso).toLocaleString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
        }) : "Data a definir";

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            {/* Cabeçalho */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Jogos</h1>
                    <p className="text-sm text-gray-500">{total} jogo(s) cadastrado(s)</p>
                </div>
                <Button variant="success" onClick={abrirCriar} className="w-full sm:w-auto">+ Novo jogo</Button>
            </div>

            {/* Busca */}
            <div className="mb-4">
                <Input fullWidth placeholder="Buscar por time..." value={search}
                    onChange={(e) => setSearch(e.target.value)} />
            </div>

            {/* Lista */}
            {loading ? (
                <p className="py-10 text-center text-gray-500">Carregando jogos...</p>
            ) : jogos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center">
                    <p className="text-gray-500">Nenhum jogo encontrado.</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {jogos.map((j) => {
                        const finalizado = j.gol_a_real !== null && j.gol_a_real !== undefined;
                        return (
                            <li key={j.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-gray-800">
                                            {j.timeA?.nome ?? "Time A"} <span className="text-gray-400">vs</span> {j.timeB?.nome ?? "Time B"}
                                        </p>
                                        <p className="text-xs text-gray-500">{fmtData(j.data_jogo)}</p>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                        finalizado ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                                    }`}>
                                        {finalizado ? `${j.gol_a_real} - ${j.gol_b_real}` : "Agendado"}
                                    </span>
                                </div>
                                <div className="mt-3 flex justify-end gap-2">
                                    <Button size="sm" variant="secondary" onClick={() => abrirEditar(j)}>Editar</Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(j)}>Excluir</Button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

            <JogoFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                times={allTeams}
                jogoEditando={jogoEditando}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default JogosPage;