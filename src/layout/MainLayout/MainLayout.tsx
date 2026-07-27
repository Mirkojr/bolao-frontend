import { Outlet } from 'react-router-dom';
import { NavBar } from '@/shared/components/NavBar';
import { Footer } from '@/shared/components/footer';

// Componente de layout principal que envolve as páginas com NavBar e Footer
export function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <header>
                <NavBar />
            </header>
            
            <main className="grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}