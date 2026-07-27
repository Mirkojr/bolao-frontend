import { useState } from 'react';
import { exportService } from '@/shared/services/export-service';

interface ExportButtonsProps {
  bolaoId: number | string;
}

export function ExportButtons({ bolaoId }: ExportButtonsProps) {
  const [carregando, setCarregando] = useState<'excel' | 'pdf' | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function handleExport(formato: 'excel' | 'pdf') {
    setErro(null);
    setCarregando(formato);
    try {
      if (formato === 'excel') {
        await exportService.exportarExcel(bolaoId);
      } else {
        await exportService.exportarPdf(bolaoId);
      }
    } catch {
      setErro('Não foi possível gerar o arquivo. Tente novamente.');
    } finally {
      setCarregando(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleExport('excel')}
          disabled={carregando !== null}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {carregando === 'excel' ? 'Gerando…' : '📊 Exportar Excel'}
        </button>

        <button
          type="button"
          onClick={() => handleExport('pdf')}
          disabled={carregando !== null}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {carregando === 'pdf' ? 'Gerando…' : '📄 Exportar PDF'}
        </button>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}
    </div>
  );
}