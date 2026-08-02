import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Time } from "@/shared/interfaces/time";
import { useTimesPaginado } from "@/shared/hooks/useTimesPaginado";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Pagination } from "@/shared/components/Pagination";
import { TimeFormModal } from "./components/TimeFormModal";

export const TimesPage = () => {
    const { isAuthenticated } = useAuth();
    const {
        times, loading, page, setPage, totalPages, total,
        search, setSearch, criarTime, atualizarTime, deletarTime,
    } = useTimesPaginado();

    const [modalOpen, setModalOpen] = useState(false);
    const [timeEditando, setTimeEditando] = useState<Time | null>(null);

    if (!isAuthenticated) {
        return <div className="p-6 text-red-500">Acesso negado. Faça login como administrador.</div>;
    }

    const abrirCriar = () => { setTimeEditando(null); setModalOpen(true); };
    const abrirEditar = (t: Time) => { setTimeEditando(t); setModalOpen(true); };

    const handleSubmit = async (dados: Partial<Time>) => {
        if (timeEditando) await atualizarTime(String(timeEditando.id), dados);
        else await criarTime(dados);
    };

    const handleDelete = async (t: Time) => {
        if (confirm(`Excluir o time "${t.nome}"? Essa ação não pode ser desfeita.`)) {
            await deletarTime(String(t.id));
        }
    };

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Times</h1>
                    <p className="text-sm text-gray-500">{total} time(s) cadastrado(s)</p>
                </div>
                <Button variant="success" onClick={abrirCriar} className="w-full sm:w-auto">+ Novo time</Button>
            </div>

            <div className="mb-4">
                <Input fullWidth placeholder="Buscar time..." value={search}
                    onChange={(e) => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <p className="py-10 text-center text-gray-500">Carregando times...</p>
            ) : times.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center">
                    <p className="text-gray-500">Nenhum time encontrado.</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {times.map((t) => (
                        <li key={t.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                    {t.sigla}
                                </div>
                                <p className="truncate font-medium text-gray-800">{t.nome}</p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                                <Button size="sm" variant="secondary" onClick={() => abrirEditar(t)}>Editar</Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(t)}>Excluir</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

            <TimeFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit} timeEditando={timeEditando} />
        </div>
    );
};

export default TimesPage;