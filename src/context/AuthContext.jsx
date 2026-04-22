// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const storedUser = authService.getUser();
        
        if (token && storedUser) {
            setUser(storedUser);
            // Refresh user data to ensure token is still valid
            authService.getMe().catch(() => {
                // If token is invalid, logout
                logout();
            });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        setError(null);
        try {
            const response = await authService.login(username, password);
            setUser(response.user);
            return { success: true, user: response.user };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Login gagal';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (username, password, isKasir = false) => {
        setError(null);
        try {
            if (isKasir) {
                await authService.registerKasir(username, password);
            } else {
                await authService.register(username, password);
            }
            // Auto login after registration
            return await login(username, password);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Registrasi gagal';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isKasir: user?.role === 'kasir',
        isStudent: user?.role === 'student',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};