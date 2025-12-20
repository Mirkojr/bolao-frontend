import { useParams } from "react-router-dom";
import { useBolaoEdicao } from "../adm-listar-boloes/hooks/useBolaoEdicao";
import { BolaoService } from "../adm-listar-boloes/services/bolao-service";
import { PalpiteCell } from "./components/palpite-cell";
import { AddParticipanteForm, AddJogoForm } from "./components/bolao-tool-bar"; 

export const EditarBolaoPage = () => {
    const { id } = useParams();
    const { jogos, participantes, palpites, loading, refresh } = useBolaoEdicao(id);

    // --- FUNÇÕES DE AÇÃO ---
    
    const handleAddParticipante = async (nome: string) => {
        if (!id) return;
        try {
            await BolaoService.addParticipante(id, nome);
            await refresh(); // Recarrega a tabela para aparecer a nova linha
        } catch (error) {
            alert("Erro ao adicionar participante");
        }
    };

    const handleAddJogo = async (timeA: string, timeB: string) => {
        if (!id) return;
        try {
            await BolaoService.addJogo(id, timeA, timeB);
            await refresh(); // Recarrega a tabela para aparecer a nova coluna
        } catch (error) {
            alert("Erro ao adicionar jogo");
        }
    };

    const handleSavePalpite = async (partId: string, jogoId: string, pa: number, pb: number) => {
        if (!id) return;
        await BolaoService.savePalpite(id, partId, jogoId, pa, pb);
        await refresh();
    };

    if (loading) return <p className="p-6">Carregando...</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Gerenciar Bolão #{id}</h1>

            {/* --- ÁREA DE CADASTRO (TOOLBAR) --- */}
            <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-100 rounded-lg border border-gray-200">
                <AddParticipanteForm onAdd={handleAddParticipante} />
                <div className="w-px bg-gray-300 mx-2 hidden md:block"></div> {/* Divisória */}
                <AddJogoForm onAdd={handleAddJogo} />
            </div>

            {/* --- TABELA (MATRIZ) --- */}
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-4 py-3 sticky left-0 bg-gray-100 border-r z-10">Participante</th>
                            {jogos.map(jogo => (
                                <th key={jogo.id} className="px-4 py-3 text-center border-l min-w-30">
                                    {jogo.timeA} <span className="text-gray-400">x</span> {jogo.timeB}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {participantes.length === 0 && (
                            <tr>
                                <td colSpan={jogos.length + 1} className="p-6 text-center text-gray-400">
                                    Nenhum participante adicionado ainda. Use o formulário acima.
                                </td>
                            </tr>
                        )}
                        {participantes.map(p => (
                            <tr key={p.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 font-bold sticky left-0 bg-white border-r">
                                    {p.nome}
                                </td>
                                {jogos.map(jogo => {
                                    const palpite = palpites.find(
                                        pl => pl.participanteId === p.id && pl.jogoId === jogo.id
                                    );
                                    return (
                                        <td key={`${p.id}-${jogo.id}`} className="px-2 py-2 text-center border-l">
                                            <PalpiteCell 
                                                palpite={palpite}
                                                onSave={(pa, pb) => handleSavePalpite(p.id, jogo.id, pa, pb)}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EditarBolaoPage;