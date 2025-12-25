import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
    // Pegamos o logout também para permitir sair direto da home
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            
            {/* Conteúdo Principal Centralizado */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                
                <div className="max-w-3xl space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                        Bem vindo, <span className="text-green-600">{user?.nome || 'Visitante'}</span>!
                    </h1>

                    <p className="text-lg text-gray-600 md:text-xl max-w-2xl mx-auto">
                        {isAuthenticated 
                            ? 'Você está conectado. Acesse o painel administrativo para gerenciar os bolões.'
                            : 'Gerencie seus bolões de forma fácil e rápida. Por favor, faça login para acessar todas as funcionalidades.'}
                    </p>

                    {/* Botões de Ação Dinâmicos */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to="/admin/bolao-crud" 
                                    className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition duration-300 transform hover:-translate-y-1"
                                >
                                    Acessar Painel Admin
                                </Link>
                                <button 
                                    onClick={logout}
                                    className="px-8 py-3 bg-white text-red-600 border border-red-200 font-semibold rounded-lg shadow-sm hover:bg-red-50 transition duration-300"
                                >
                                    Sair da Conta
                                </button>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300 transform hover:-translate-y-1"
                            >
                                Fazer Login
                            </Link>
                        )}
                    </div>
                </div>

            </main>

        </div>
    );
}

export default Home;