
export const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-6 text-center text-gray-400 text-sm">
                &copy; {currentYear} Sistema de Bolão. Todos os direitos reservados.
        </footer>
    )
};

