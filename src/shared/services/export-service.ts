const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
const TOKEN_KEY = 'meu_token';

type Formato = 'excel' | 'pdf';

async function baixarArquivo(bolaoId: number | string, formato: Formato): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY);
  const ext = formato === 'excel' ? 'xlsx' : 'pdf';

  const resp = await fetch(`${API_URL}/boloes/${bolaoId}/export/${formato}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!resp.ok) {
    throw new Error('Falha ao exportar o bolão.');
  }

  const blob = await resp.blob();
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
  exportarPdf: (bolaoId: number | string) => baixarArquivo(bolaoId, 'pdf'),
};