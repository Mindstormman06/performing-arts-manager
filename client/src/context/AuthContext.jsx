import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContextInstance';

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const savedToken = localStorage.getItem('token');
        return savedToken ? { id: 'decoded-id-here' } : null;
    });

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};