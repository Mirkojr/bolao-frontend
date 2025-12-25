import type { Participante } from "@/shared/interfaces/participante";
import { AddParticipanteForm } from "./add-participante-form";
import { ParticipanteList } from "./participante-list";

interface ParticipantesSectionProps {
    participantes: Participante[];
    onAdd: (nome: string) => void;
    onRemove: (id: number) => void;
}

export const ParticipantesSection = ({ participantes, onAdd, onRemove }: ParticipantesSectionProps) => {
    return (
        <section className="mt-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Participantes</h2>
                {/* O formulário fica alinhado com o título ou abaixo, dependendo do design */}
                <AddParticipanteForm onAdd={onAdd} />
            </div>

            <div className="bg-gray-50 rounded-lg p-1">
                <ParticipanteList 
                    participantes={participantes} 
                    onRemove={onRemove} 
                />
            </div>
        </section>
    );
};

export default ParticipantesSection;