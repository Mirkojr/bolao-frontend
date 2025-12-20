import { useState } from 'react';
import type { AddBolaoProps } from '../interface/add-bolao-props';

export const AddBolaoForm = ({onCriar, isCreating}: AddBolaoProps) => {
  const [nome, setNome] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) return;

    try {
      await onCriar(nome);
      setNome('');
    } catch (error) {
      alert('Erro ao criar o bolão.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 bg-white rounded shadow-sm">
      <label className="text-sm font-bold text-gray-700">Novo Bolão</label>
      <div className="flex gap-2 max-[400px]:flex-col">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Copa do Mundo 2026"
          className="flex-1 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <button
          type="submit"
          disabled={isCreating || !nome.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          {isCreating ? 'Criando...' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
};