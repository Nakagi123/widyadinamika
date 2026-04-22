// src/components/layout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

function Layout() {
    const { user, logout, isAuthenticated, isKasir } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Pass auth state to your navbar */}
            <Navbar 
                user={user}
                isAuthenticated={isAuthenticated}
                isKasir={isKasir}
                onLogout={handleLogout}
            />
            
            {/* Main content */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;