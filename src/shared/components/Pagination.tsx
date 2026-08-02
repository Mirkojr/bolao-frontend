import { Button } from "./Button";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination = ({ page, totalPages, onPageChange, className = "" }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-center gap-3 mt-4 ${className}`}>
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                ← Anterior
            </Button>

            <span className="text-sm text-gray-600">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>

            <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                Próxima →
            </Button>
        </div>
    );
};