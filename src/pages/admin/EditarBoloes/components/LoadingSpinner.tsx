interface LoadingSpinnerProps {
    message?: string;
    size?: "sm" | "md" | "lg";
    position?: "inline" | "fixed" | "centered";
}

const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10"
};

export const LoadingSpinner = ({ 
    message = "Carregando...", 
    size = "md",
    position = "inline"
}: LoadingSpinnerProps) => {
    
    const spinner = (
        <svg 
            className={`animate-spin ${sizeStyles[size]}`} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
        >
            <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
            />
            <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    if (position === "fixed") {
        return (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg animate-pulse z-50 flex items-center gap-2">
                {spinner}
                <span className="text-sm font-medium">{message}</span>
            </div>
        );
    }

    if (position === "centered") {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                {spinner}
                <p className="mt-3 text-sm">{message}</p>
            </div>
        );
    }

    // inline
    return (
        <div className="flex items-center gap-2">
            {spinner}
            {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
    );
};
