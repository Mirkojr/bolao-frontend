import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "elevated" | "outlined";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    hoverable?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
    children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
    default: "bg-white border border-gray-200 shadow-sm",
    elevated: "bg-white border border-gray-100 shadow-md",
    outlined: "bg-white border-2 border-gray-300"
};

const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
};

export const Card = ({ 
    variant = "default",
    hoverable = false,
    padding = "md",
    className = "",
    children,
    ...props 
}: CardProps) => {
    
    const baseStyles = "rounded-lg transition-all";
    const hoverStyles = hoverable ? "hover:shadow-lg hover:border-gray-300 cursor-pointer" : "";
    
    const combinedClassName = `
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <div className={combinedClassName} {...props}>
            {children}
        </div>
    );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const CardHeader = ({ className = "", children, ...props }: CardHeaderProps) => {
    return (
        <div className={`border-b border-gray-200 pb-3 mb-3 ${className}`} {...props}>
            {children}
        </div>
    );
};

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
}

export const CardTitle = ({ className = "", children, ...props }: CardTitleProps) => {
    return (
        <h3 className={`text-lg font-semibold text-gray-800 ${className}`} {...props}>
            {children}
        </h3>
    );
};

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const CardContent = ({ className = "", children, ...props }: CardContentProps) => {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
};

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const CardFooter = ({ className = "", children, ...props }: CardFooterProps) => {
    return (
        <div className={`border-t border-gray-200 pt-3 mt-3 ${className}`} {...props}>
            {children}
        </div>
    );
};
