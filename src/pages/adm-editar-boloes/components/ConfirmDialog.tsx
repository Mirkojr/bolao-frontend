interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
    variant?: "danger" | "warning" | "info";
}

const variantStyles = {
    danger: {
        icon: "text-red-600",
        button: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    },
    warning: {
        icon: "text-yellow-600",
        button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
    },
    info: {
        icon: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
    }
};

export const ConfirmDialog = ({ 
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    isOpen,
    variant = "danger"
}: ConfirmDialogProps) => {
    
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                    <div className={`rounded-full p-3 ${variant === 'danger' ? 'bg-red-100' : variant === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                        <svg 
                            className={`h-6 w-6 ${variantStyles[variant].icon}`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-gray-600 text-center mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantStyles[variant].button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Hook helper para usar o dialog
export const useConfirmDialog = () => {
    const confirm = (options: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>): Promise<boolean> => {
        return new Promise((resolve) => {
            // Esta é uma implementação simplificada
            // Em produção, você usaria um contexto ou biblioteca de modais
            const result = window.confirm(`${options.title}\n\n${options.message}`);
            resolve(result);
        });
    };

    return { confirm };
};
