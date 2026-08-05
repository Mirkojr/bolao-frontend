import { useState } from 'react';
import {
  exportService,
  FORMATO_PDF_LABEL,
  type FormatoPdf,
} from '@/shared/services/export-service';

interface ExportButtonsProps {
  bolaoId: number | string;
}

const AJUDA: Record<FormatoPdf, string> = {
  unico: 'Tudo em uma página só, do tamanho exato da tabela.',
  a4: 'Dividido em folhas A4, repetindo a coluna dos jogos.',
  lista: 'Ranking + palpites de cada jogo, um embaixo do outro.',
};

export function ExportButtons({ bolaoId }: ExportButtonsProps) {
  const [carregando, setCarregando] = useState<'excel' | 'pdf' | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [formato, setFormato] = useState<FormatoPdf>('unico');

  async function handleExport(tipo: 'excel' | 'pdf') {
    setErro(null);
    setCarregando(tipo);
    try {
      if (tipo === 'excel') await exportService.exportarExcel(bolaoId);
      else await exportService.exportarPdf(bolaoId, formato);
    } catch (e: any) {
      setErro(e?.message ?? 'Não foi possível gerar o arquivo. Tente novamente.');
    } finally {
      setCarregando(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleExport('excel')}
          disabled={carregando !== null}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-green-600 px-4 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {carregando === 'excel' ? 'Gerando…' : '📊 Exportar Excel'}
        </button>

        <button
          type="button"
          onClick={() => handleExport('pdf')}
          disabled={carregando !== null}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-red-600 px-4 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {carregando === 'pdf' ? 'Gerando…' : '📄 Exportar PDF'}
        </button>

        <select
          value={formato}
          onChange={(e) => setFormato(e.target.value as FormatoPdf)}
          disabled={carregando !== null}
          className="h-11 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 disabled:opacity-60"
        >
          {(Object.keys(FORMATO_PDF_LABEL) as FormatoPdf[]).map((f) => (
            <option key={f} value={f}>{FORMATO_PDF_LABEL[f]}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-500">{AJUDA[formato]}</p>

      {erro && <p className="text-sm text-red-600">{erro}</p>}
    </div>
  );
}