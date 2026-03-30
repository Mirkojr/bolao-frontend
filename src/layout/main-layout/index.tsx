import { Outlet } from 'react-router-dom';
import { NavBar } from '@/shared/components/nav-bar';
import { Footer } from '@/shared/components/footer';

// Componente de layout principal que envolve as páginas com NavBar e Footer
export function MainLayout() {
    return (
        <div className="app-container">
            <header>
                <NavBar />
            </header>
            
            <main>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}