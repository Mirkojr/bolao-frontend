import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

import Home from '@/pages/home';
import AdminBolaoPage from '@/pages/admin/ListarBoloes/ListarBoloes';
import { Login } from '@/pages/login/login-page';
import EditarBolaoPage from '@/pages/admin/EditarBoloes/EditarBoloes';
import NotFoundPage from '@/pages/not-found/not-found-page';
import TimesPage from '@/pages/admin/Times/TimesPage';
import JogosPage from '@/pages/admin/Jogos/JogosPage';
import { RecalcularTudo } from '@/pages/admin/RecalcularTudo/RecalcularTudo';

import { MainLayout } from '@/layout/MainLayout/MainLayout';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin/bolao-crud" element={<AdminBolaoPage />} />
                        <Route path="/admin/edit/:id" element={<EditarBolaoPage />} />
                        <Route path="/admin/times" element={<TimesPage />} />
                        <Route path="/admin/jogos" element={<JogosPage />} />
                        <Route path="/admin/recalcular-tudo" element={<RecalcularTudo />} />
                    </Route>

                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}