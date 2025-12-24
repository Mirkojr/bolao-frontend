import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from '@/pages/home';
import AdminBolaoPage from '@/pages/adm-listar-boloes/adm-listar-boloes-page';
import Login from '@/pages/login/login-page';
import EditarBolaoPage from '@/pages/adm-editar-boloes/adm-editar-boloes-page';
import NotFoundPage from '@/pages/not-found/not-found-page';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login></Login>} />
                <Route path="/admin/bolao-crud" element={<AdminBolaoPage></AdminBolaoPage>} />
                <Route path="/admin/edit/:id" element={<EditarBolaoPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}
