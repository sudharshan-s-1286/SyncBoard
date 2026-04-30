import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            try {
                const res = await api.get('/users/me');
                localStorage.setItem('user', JSON.stringify(res.data));
                setUser(res.data);
            } catch {
                // ignore on fresh session
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
    };

    const register = async (name, email, password) => {
        await api.post('/auth/register', { name, email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const refreshUser = async () => {
        const res = await api.get('/users/me');
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
