// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();
    
    // Debug logging
    // console.log("ProtectedRoute - path:", window.location.pathname);
    // console.log("ProtectedRoute - allowedRoles:", allowedRoles);
    // console.log("ProtectedRoute - user:", user);
    // console.log("ProtectedRoute - user role:", user?.role);
    // console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
    
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
    
    if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to /auth");
        return <Navigate to="/auth" replace />;
    }
    
    // Check role permissions
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        console.log(`Role ${user?.role} not allowed. Allowed:`, allowedRoles);
        console.log("Redirecting to /");
        return <Navigate to="/" replace />;
    }
    
    console.log("Access granted!");
    return children;
};