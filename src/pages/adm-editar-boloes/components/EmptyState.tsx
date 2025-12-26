import { ReactNode } from "react";

interface EmptyStateProps {
    title?: string;
    message: string;
    icon?: ReactNode;
    action?: ReactNode;
}

export const EmptyState = ({ 
    title,
    message, 
    icon,
    action 
}: EmptyStateProps) => {
    
    const defaultIcon = (
        <svg 
            className="h-12 w-12 text-gray-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
            />
        </svg>
    );

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow border border-gray-200 text-center">
            <div className="mb-4">
                {icon || defaultIcon}
            </div>
            
            {title && (
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {title}
                </h3>
            )}
            
            <p className="text-gray-500 mb-4 max-w-md">
                {message}
            </p>
            
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
};
