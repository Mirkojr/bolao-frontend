import { Link } from "react-router-dom";
import type { BoloesTableProps } from "@/shared/interfaces/bolao-table-props";

export const BoloesTable = ({ boloes }: BoloesTableProps) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Nome do Bolão</th>
            <th className="px-6 py-3">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {boloes.map((bolao) => (
            <tr 
              key={bolao.id} 
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-medium text-gray-900">
                <Link 
                  to={`/admin/edit/${bolao.id}`} 
                  state={{ bolaoData: bolao }} 
                  className="hover:text-green-600 hover:underline transition-colors"
                >
                  {bolao.nome}
                </Link>
              </td>
              <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                {new Date(bolao.created_at).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};