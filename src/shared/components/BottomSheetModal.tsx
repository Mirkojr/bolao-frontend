import { useEffect, type ReactNode } from "react";

/** contador global pra não destravar o scroll quando há sheets empilhados */
let travas = 0;

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    /** Ações fixas no rodapé (ficam "grudadas" no mobile) */
    footer?: ReactNode;
    /** Sobe o sheet acima de outro já aberto */
    layer?: 1 | 2;
    /** Ocupa quase a tela toda (bom para listas) */
    tall?: boolean;
    /** Remove o padding do corpo (listas encostadas nas bordas) */
    flushBody?: boolean;
};

export const BottomSheetModal = ({
    isOpen, onClose, title, children, footer, layer = 1, tall = false, flushBody = false,
}: Props) => {
    useEffect(() => {
        if (!isOpen) return;
        travas += 1;
        document.body.style.overflow = "hidden";
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") { e.stopPropagation(); onClose(); }
        };
        window.addEventListener("keydown", onEsc);
        return () => {
            travas = Math.max(0, travas - 1);
            if (travas === 0) document.body.style.overflow = "";
            window.removeEventListener("keydown", onEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const z = layer === 2 ? "z-[60]" : "z-50";

    return (
        <div
            className={`fixed inset-0 ${z} flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4`}
            onClick={onClose}
        >
            <div
                className={`flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl
                    ${tall ? "h-[88vh] sm:h-[80vh]" : "max-h-[92vh]"}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                {/* Header */}
                <div className="relative shrink-0 bg-indigo-900 px-5 py-4 text-center">
                    <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/30 sm:hidden" />
                    <h2 className="text-base font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        aria-label="Fechar"
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Conteúdo rolável */}
                <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${flushBody ? "" : "px-5 py-5"}`}>
                    {children}
                </div>

                {/* Footer fixo */}
                {footer && (
                    <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};