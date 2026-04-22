// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();
    
    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }
    
    // Check role permissions
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Redirect kasir to admin, student to home
        if (user?.role === 'kasir') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />;
    }
    
    return children;
};