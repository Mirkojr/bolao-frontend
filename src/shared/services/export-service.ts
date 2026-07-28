import { httpClient } from "../api/httpClient";

type Formato = 'excel' | 'pdf';

async function baixarArquivo(bolaoId: number | string, formato: Formato): Promise<void> {
  const ext = formato === 'excel' ? 'xlsx' : 'pdf';

  try {
    const blob = await httpClient.get<Blob>(`/boloes/${bolaoId}/export/${formato}`, {
      responseType: 'blob' 
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bolao-${bolaoId}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    throw new Error('Falha ao exportar o bolão.');
  }
}

export const exportService = {
  exportarExcel: (bolaoId: number | string) => baixarArquivo(bolaoId, 'excel'),
  exportarPdf: (bolaoId: number | string) => baixarArquivo(bolaoId, 'pdf'),
};