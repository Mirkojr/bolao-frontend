interface TeamDisplayProps {
    teamA: string;
    teamB: string;
    separator?: string;
    variant?: "default" | "compact" | "vertical";
    className?: string;
}

export const TeamDisplay = ({ 
    teamA, 
    teamB, 
    separator = "x",
    variant = "default",
    className = ""
}: TeamDisplayProps) => {
    
    if (variant === "vertical") {
        return (
            <div className={`flex flex-col items-center gap-1 ${className}`}>
                <span className="font-semibold text-gray-800">{teamA}</span>
                <span className="text-xs text-gray-400 uppercase">{separator}</span>
                <span className="font-semibold text-gray-800">{teamB}</span>
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <span className={`text-sm ${className}`}>
                <span className="font-medium">{teamA}</span>
                <span className="text-gray-400 mx-1">{separator}</span>
                <span className="font-medium">{teamB}</span>
            </span>
        );
    }

    // default
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="font-semibold text-gray-800">{teamA}</span>
            <span className="text-gray-400 font-bold">{separator}</span>
            <span className="font-semibold text-gray-800">{teamB}</span>
        </div>
    );
};
