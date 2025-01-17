import React, { createContext, useState, useEffect } from 'react';
import { refreshAccessToken } from '../services/auth';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = await refreshAccessToken();
            if (token) {
                // Decode user info if needed
                setUser({ token });
            }
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
