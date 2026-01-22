import { type InputHTMLAttributes, forwardRef } from "react";

type InputVariant = "default" | "error" | "success";
type InputSize = "sm" | "md" | "lg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: InputVariant;
    inputSize?: InputSize;
    fullWidth?: boolean;
    error?: string;
    label?: string;
}

const variantStyles: Record<InputVariant, string> = {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500"
};

const sizeStyles: Record<InputSize, string> = {
    sm: "px-2 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base"
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ 
        variant = "default",
        inputSize = "md",
        fullWidth = false,
        error,
        label,
        className = "",
        disabled,
        ...props 
    }, ref) => {
        
        const effectiveVariant = error ? "error" : variant;
        
        const baseStyles = "border rounded outline-none transition-all";
        const disabledStyles = "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60";
        const widthStyles = fullWidth ? "w-full" : "";
        
        const combinedClassName = `
            ${baseStyles}
            ${variantStyles[effectiveVariant]}
            ${sizeStyles[inputSize]}
            ${disabledStyles}
            ${widthStyles}
            ${className}
        `.trim().replace(/\s+/g, ' ');

        return (
            <div className={fullWidth ? "w-full" : "inline-block"}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    disabled={disabled}
                    className={combinedClassName}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-red-600">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
