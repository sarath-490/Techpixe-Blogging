import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Set header before making request
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const { data } = await api.get('/auth/me');
                if (data.success) {
                    setUser(data.data);
                } else {
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                }
            } catch (err) {
                console.error("Auth Check Failed:", err);
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []); // Empty dependency array ensures this runs once on mount

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.success) {
            localStorage.setItem('token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data.user);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
