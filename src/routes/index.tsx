import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

import Home from '@/pages/Home';
import AdminBolaoPage from '@/pages/admin/ListarBoloes/adm-listar-boloes-page';
import { Login } from '@/pages/Login/login-page';
import EditarBolaoPage from '@/pages/admin/EditarBoloes/adm-editar-boloes-page';
import NotFoundPage from '@/pages/Not-found/not-found-page';
import { AdicionarTimePage } from '@/pages/AdicionarTime/adicionar-time';

import { MainLayout } from '@/layout/main-layout';

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
