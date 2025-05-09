'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    nombre?: string;
    telefono?: string;
    rol: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void; // Fixed parameter order
    logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                if (typeof window !== 'undefined') {
                    // Load user data
                    const storedUser = localStorage.getItem('spa-logueado');
                    // Load token
                    const storedToken = localStorage.getItem('token');

                    if (mounted) {
                        if (storedUser) setUser(JSON.parse(storedUser));
                        if (storedToken) setToken(storedToken);
                    }
                }
            } catch (error) {
                console.error('Error loading auth data from localStorage:', error);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        initializeAuth();

        return () => {
            mounted = false;
        };
    }, []);

    // Fixed login function with correct parameter order
    const login = (newToken: string, userData: User) => {
        console.log("AuthContext: Saving user data:", userData);
        console.log("AuthContext: User role:", userData.rol);

        try {
            // Set user data
            setUser(userData);
            localStorage.setItem('spa-logueado', JSON.stringify(userData));

            // Set token
            setToken(newToken);
            localStorage.setItem('token', newToken);

            console.log("AuthContext: Auth data saved successfully");
        } catch (error) {
            console.error('Error saving auth data to localStorage:', error);
        }
    };

    const logout = () => {
        try {
            setUser(null);
            setToken(null);
            localStorage.removeItem('spa-logueado');
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Error removing auth data from localStorage:', error);
        }
    };

    const value = {
        user,
        token,
        login,
        logout,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}