import { forwardRef } from "react";

interface ScoreInputProps {
    scoreA: string | number;
    scoreB: string | number;
    onScoreAChange: (value: string) => void;
    onScoreBChange: (value: string) => void;
    onSave?: () => void;
    onCancel?: () => void;
    disabled?: boolean;
    showActions?: boolean;
    saving?: boolean;
    separator?: string;
    size?: "sm" | "md" | "lg";
    autoFocus?: boolean;
}

const sizeStyles = {
    sm: { input: "w-8 p-1 text-xs", separator: "text-xs" },
    md: { input: "w-10 p-1 text-sm", separator: "text-sm" },
    lg: { input: "w-12 p-2 text-base", separator: "text-base" }
};

export const ScoreInput = forwardRef<HTMLInputElement, ScoreInputProps>(
    ({ 
        scoreA,
        scoreB,
        onScoreAChange,
        onScoreBChange,
        onSave,
        onCancel,
        disabled = false,
        showActions = false,
        saving = false,
        separator = "x",
        size = "md",
        autoFocus = false
    }, ref) => {
        
        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && onSave) {
                onSave();
            }
            if (e.key === 'Escape' && onCancel) {
                onCancel();
            }
        };

        return (
            <div className="flex items-center justify-center gap-1">
                <input
                    ref={ref}
                    type="number"
                    min="0"
                    value={scoreA}
                    onChange={(e) => onScoreAChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    className={`${sizeStyles[size].input} text-center border rounded outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                
                <span className={`text-gray-400 font-bold ${sizeStyles[size].separator}`}>
                    {separator}
                </span>
                
                <input
                    type="number"
                    min="0"
                    value={scoreB}
                    onChange={(e) => onScoreBChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    className={`${sizeStyles[size].input} text-center border rounded outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                
                {showActions && (
                    <div className="flex flex-col gap-1 ml-1">
                        <button 
                            onClick={onSave} 
                            disabled={saving || disabled}
                            className="text-green-600 hover:text-green-800 text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Salvar"
                            type="button"
                        >
                            {saving ? '⏳' : '✔'}
                        </button>
                        <button 
                            onClick={onCancel}
                            disabled={disabled}
                            className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50 transition-colors"
                            title="Cancelar"
                            type="button"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        );
    }
);

ScoreInput.displayName = "ScoreInput";
