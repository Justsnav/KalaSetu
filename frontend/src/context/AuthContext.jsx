import { useState, useEffect, createContext, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMe = async () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    const response = await api.get('/auth/me');
                    if (response.data?.user) {
                        setUser(response.data.user);
                    }
                } catch (err) {
                    console.error("Failed to fetch user session:", err);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        fetchMe();
    }, []);

    const login = (userData, jwt) => {
        setUser(userData);
        setToken(jwt);
        localStorage.setItem('token', jwt);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const updateUser = (updatedUserData) => {
        setUser(prev => ({ ...prev, ...updatedUserData }));
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}