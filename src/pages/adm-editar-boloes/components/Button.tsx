import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "success" | "danger" | "ghost" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
    success: "bg-green-600 text-white hover:bg-green-700 border-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700 border-transparent",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 border-transparent",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border-gray-300"
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ 
        variant = "primary", 
        size = "md",
        isLoading = false,
        fullWidth = false,
        disabled,
        className = "",
        children,
        ...props 
    }, ref) => {
        
        const baseStyles = "font-medium rounded transition-colors border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
        const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";
        const widthStyles = fullWidth ? "w-full" : "";
        
        const combinedClassName = `
            ${baseStyles}
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${disabledStyles}
            ${widthStyles}
            ${className}
        `.trim().replace(/\s+/g, ' ');

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={combinedClassName}
                {...props}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {children}
                    </span>
                ) : children}
            </button>
        );
    }
);

Button.displayName = "Button";
