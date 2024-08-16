import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, logoutUser, registerUser } from '../api/auth';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({});

const isTokenValid = (token) => {
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        return decoded.exp >= Date.now() / 1000;
    } catch (error) {
        return false;
    }
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (isTokenValid(token)) {
            const decoded = jwtDecode(token);
            setIsAuthenticated(true);
            setUser(decoded); // Store user information from the token
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    }, []);

    const login = async (email, password) => {
        const { success, error } = await loginUser(email, password);
        if (success) {
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            setIsAuthenticated(true);
            setUser(decoded);
        }
        return { success, error };
    };

    const logout = () => {
        logoutUser();
        setIsAuthenticated(false);
        setUser(null);
    };

    const register = async (email, password, name, passwordConfirmation) => {
        const { success, data, error } = await registerUser(email, password, name, passwordConfirmation);
        // You can choose to do something with the data, e.g., show a success message
        return { success, data, error };
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
