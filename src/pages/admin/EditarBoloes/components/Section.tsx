import type { ReactNode } from "react";

interface SectionProps {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    action?: ReactNode;
    className?: string;
}

export const Section = ({ 
    title, 
    subtitle,
    children, 
    action,
    className = "" 
}: SectionProps) => {
    return (
        <section className={`mb-8 ${className}`}>
            {(title || action) && (
                <div className="flex justify-between items-center mb-4">
                    <div>
                        {title && (
                            <h2 className="text-xl font-bold text-gray-800">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-sm text-gray-600 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {action && (
                        <div>
                            {action}
                        </div>
                    )}
                </div>
            )}
            <div>
                {children}
            </div>
        </section>
    );
};
