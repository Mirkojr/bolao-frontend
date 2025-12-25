import { Outlet } from 'react-router-dom';
import NavBar from '@/shared/components/nav-bar/nav-bar';
import { Footer } from '@/shared/components/footer/footer';

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