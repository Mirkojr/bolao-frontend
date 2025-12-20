export interface AddBolaoProps {
  onCriar: (nome: string) => Promise<void>;
  isCreating: boolean;
}