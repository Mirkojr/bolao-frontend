import type { ButtonHTMLAttributes } from "react";

// Tipos simples
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
    size?: "sm" | "md" | "lg";
}

// Mapa de cores
const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

// Tamnhos 
const sizes = {
    sm: "px-3 py-1 text-sm", // Pequeno
    md: "px-4 py-2 text-base", // Médio (Padrão)
    lg: "px-6 py-3 text-lg", // Grande
};

export const Button = ({ 
    variant = "primary", 
    size = "md",
    className = "", 
    children, 
    ...props 
}: ButtonProps) => {

    const classes = `px-4 py-2 
                    rounded font-medium transition-colors 
                    ${variants[variant]} 
                    ${className}
                    ${sizes[size]}`;

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};