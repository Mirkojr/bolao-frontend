interface PlacarStepperProps {
    valor: number;
    onChange: (valor: number) => void;
    rotulo: string;
    disabled?: boolean;
}

export const PlacarStepper = ({ valor, onChange, rotulo, disabled }: PlacarStepperProps) => {
    const alterar = (delta: number) => {
        const novo = Math.min(20, Math.max(0, valor + delta));
        if (novo !== valor) {
            onChange(novo);
            if ('vibrate' in navigator) navigator.vibrate(8);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                type="button"
                aria-label={`Aumentar gols de ${rotulo}`}
                disabled={disabled}
                onClick={() => alterar(1)}
                className="h-11 w-14 rounded-xl bg-gray-100 text-2xl font-bold text-gray-700
                           active:scale-95 active:bg-gray-200 transition disabled:opacity-40"
            >
                +
            </button>

            <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl border-2
                           border-gray-200 bg-white text-4xl font-bold tabular-nums text-gray-900"
            >
                {valor}
            </div>

            <button
                type="button"
                aria-label={`Diminuir gols de ${rotulo}`}
                disabled={disabled || valor === 0}
                onClick={() => alterar(-1)}
                className="h-11 w-14 rounded-xl bg-gray-100 text-2xl font-bold text-gray-700
                           active:scale-95 active:bg-gray-200 transition disabled:opacity-40"
            >
                −
            </button>
        </div>
    );
};