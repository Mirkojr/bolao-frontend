
export const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">    
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
            <a href="/" className="text-blue-600 hover:underline">Voltar para a página inicial</a>
        </div>
    );
}   

export default NotFoundPage;