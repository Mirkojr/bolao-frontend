import { httpClient } from "../api/httpClient";

type Formato = 'excel' | 'pdf';
export type FormatoPdf = 'unico' | 'a4' | 'lista';

export const FORMATO_PDF_LABEL: Record<FormatoPdf, string> = {
  unico: 'Página única (recomendado)',
  a4: 'Folhas A4 (para imprimir)',
  lista: 'Resumo em lista (celular)',
};

async function baixarArquivo(
  bolaoId: number | string,
  formato: Formato,
  query = '',
): Promise<void> {
  const ext = formato === 'excel' ? 'xlsx' : 'pdf';

  const blob = await httpClient.get<Blob>(
    `/boloes/${bolaoId}/export/${formato}${query}`,
    { responseType: 'blob' },
  );

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bolao-${bolaoId}.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export const exportService = {
  exportarExcel: (bolaoId: number | string) => baixarArquivo(bolaoId, 'excel'),
  exportarPdf: (bolaoId: number | string, formato: FormatoPdf = 'unico') =>
    baixarArquivo(bolaoId, 'pdf', `?formato=${formato}`),
};