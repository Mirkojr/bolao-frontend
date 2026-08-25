import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

import Home from '@/pages/home';
import { AdminBolaoPage } from '@/pages/admin/ListarBoloes/ListarBoloes';
import { Login } from '@/pages/login/login-page';
import { Register } from '@/pages/login/register-page';
import { EditarBolaoPage } from '@/pages/admin/EditarBoloes/EditarBoloes';
import { NotFoundPage } from '@/pages/not-found/not-found-page';
import { TimesPage } from '@/pages/admin/Times/TimesPage';
import { JogosPage } from '@/pages/admin/Jogos/JogosPage';
import { RecalcularTudo } from '@/pages/admin/RecalcularTudo/RecalcularTudo';

import { AdminRoute } from '@/routes/AdminRoute';
import { AuthenticatedRoute } from '@/routes/AuthenticatedRoute';
import { MainLayout } from '@/layout/MainLayout/MainLayout';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />

                        <Route element={<AuthenticatedRoute />}>
                            <Route path="/boloes" element={<AdminBolaoPage />} />
                            <Route path="/boloes/:id" element={<EditarBolaoPage />} />
                        </Route>

                        <Route element={<AdminRoute />}>
                            <Route path="/admin/times" element={<TimesPage />} />
                            <Route path="/admin/jogos" element={<JogosPage />} />
                            <Route path="/admin/recalcular-tudo" element={<RecalcularTudo />} />
                        </Route>
                    </Route>

                    <Route path="login" element={<Login />} />
                    <Route path="cadastro" element={<Register />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}