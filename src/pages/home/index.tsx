import NavBar from '@/shared/components/nav-bar/nav-bar'
import { useAuth } from '@/context/AuthContext'

function Home() {

    const { user, isAuthenticated } = useAuth();

    return (
        <>  
            <h1>
                Bem vindo, {user?.nome || 'Visitante'}!
                {isAuthenticated ? '' : ' Por favor, faça login para acessar mais funcionalidades.'}
            </h1>  
            <div className="flex justify-center w-screen">
                <NavBar />
            </div>
        </>
    )
}

export default Home