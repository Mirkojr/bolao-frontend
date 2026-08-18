import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { NotFoundPage } from '@/pages/not-found/not-found-page';

export const AdminRoute = () => {
    const { isAuthenticated, user } = useAuth();

    const isAdmin = isAuthenticated && user?.role === 'ADMIN'; 

    if (!isAdmin) {
        // Se não for admin, fingimos que a página não existe renderizando o 404
        return <NotFoundPage />;
    }

    // Se for admin, o Outlet permite que a rota filha solicitada seja renderizada
    return <Outlet />;
};