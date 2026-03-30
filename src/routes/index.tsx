import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

import Home from '@/pages/Home';
import AdminBolaoPage from '@/pages/admin/ListarBoloes/ListarBoloes';
import { Login } from '@/pages/Login/login-page';
import EditarBolaoPage from '@/pages/admin/EditarBoloes/EditarBoloes';
import NotFoundPage from '@/pages/Not-found/not-found-page';
import { AdicionarTimePage } from '@/pages/AdicionarTime/AdicionarTime';

import { MainLayout } from '@/layout/MainLayout/MainLayout';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin/bolao-crud" element={<AdminBolaoPage></AdminBolaoPage>} />
                        <Route path="/admin/edit/:id" element={<EditarBolaoPage />} />
                        <Route path="/admin/times" element={<AdicionarTimePage />} />
                    </Route>
                
                    <Route path="login" element={<Login></Login>} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
