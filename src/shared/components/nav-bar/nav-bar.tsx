import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

function NavBar() {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    
                    {/* LADO ESQUERDO - Links de Navegação */}
                    <div className="flex items-center">
                        {/* Link da Home */}
                        <Link 
                            to="/" 
                            className="text-gray-800 hover:text-green-600 font-bold text-lg transition-colors duration-200 font-poppins mr-8"
                        >
                            Início
                        </Link>

                        {/* Link Admin (Só aparece se estiver logado) */}
                        {isAuthenticated && (
                            <Link 
                                to="/admin/bolao-crud" 
                                className="text-gray-600 hover:text-green-600 font-medium transition-colors duration-200"
                            >
                                Meus Bolões
                            </Link>
                        )}
                    </div>

                    {/* LADO DIREITO - Área do Usuário */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm text-gray-500 hidden md:block">
                                    Olá, <strong>{user?.nome}</strong>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                >
                                    Sair
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow transition-colors"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default NavBar;