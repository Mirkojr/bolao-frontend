import { forwardRef, useRef } from "react";

interface ScoreInputProps {
    scoreA: string | number;
    scoreB: string | number;
    onScoreAChange: (value: string) => void;
    onScoreBChange: (value: string) => void;
    onSave?: () => void;
    onCancel?: () => void;
    disabled?: boolean;
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
        separator = "x",
        size = "md",
        autoFocus = false
    }, ref) => {
        
        const initialValues = useRef({ a: scoreA, b: scoreB });
        const containerRef = useRef<HTMLDivElement>(null);

        const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
                initialValues.current = { a: scoreA, b: scoreB };
            }
        };

        const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
            if (e.currentTarget.contains(e.relatedTarget)) {
                return;
            }

            const hasChanged = 
                String(scoreA) !== String(initialValues.current.a) || 
                String(scoreB) !== String(initialValues.current.b);

            if (hasChanged) {
                onSave?.();
            } else {
                onCancel?.();
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                (document.activeElement as HTMLElement)?.blur();
            }
            if (e.key === 'Escape') {
                onScoreAChange(String(initialValues.current.a));
                onScoreBChange(String(initialValues.current.b));
                onCancel?.();
                (document.activeElement as HTMLElement)?.blur();
            }
        };

        // Classes CSS para esconder as setas (spin buttons)
        // Funciona no Chrome, Safari, Edge e Firefox
        const noSpinnerClass = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

        return (
            <div 
                ref={containerRef}
                className="flex items-center justify-center gap-1"
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                <input
                    ref={ref}
                    type="number"
                    min="0"
                    value={scoreA}
                    onChange={(e) => onScoreAChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    placeholder="?"
                    className={`${sizeStyles[size].input} ${noSpinnerClass} text-center border rounded outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all`}
                />
                
                <span className={`text-gray-400 font-bold select-none ${sizeStyles[size].separator}`}>
                    {separator}
                </span>
                
                <input
                    type="number"
                    min="0"
                    value={scoreB}
                    onChange={(e) => onScoreBChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    placeholder="?"
                    className={`${sizeStyles[size].input} ${noSpinnerClass} text-center border rounded outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all`}
                />
            </div>
        );
    }
);

ScoreInput.displayName = "ScoreInput";