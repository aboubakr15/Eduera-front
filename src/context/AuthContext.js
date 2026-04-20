import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [authTokens, setAuthTokens] = useState(() => {
        const access = localStorage.getItem('access_token');
        const refresh = localStorage.getItem('refresh_token');
        return access && refresh ? { access, refresh } : null;
    });
    const [loading, setLoading] = useState(true);

    const loginUser = async (email, password) => {
        try {
            const response = await api.post('/api/token/', { email, password });
            if (response.status === 200) {
                const { access, refresh } = response.data;
                setAuthTokens({ access, refresh });
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user_email', email);
                
                const decoded = decodeToken(access);
                if (decoded) {
                    const role = decoded.primary_role || decoded.role || null;
                    setUserRole(role);
                    setUser({ 
                        email, 
                        user_id: decoded.user_id,
                        primary_role: role 
                    });
                }
                return { success: true, role: userRole };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, error: error.response?.data?.detail || "Login failed" };
        }
    };

    const logoutUser = async () => {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
            try {
                await api.post('/api/token/blacklist/', { refresh });
            } catch (error) {
                console.error("Blacklist failed", error);
            }
        }

        setAuthTokens(null);
        setUser(null);
        setUserRole(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
    };

    useEffect(() => {
        const access = localStorage.getItem('access_token');
        const email = localStorage.getItem('user_email');
        if (access) {
            const decoded = decodeToken(access);
            if (decoded) {
                const role = decoded.primary_role || decoded.role || null;
                setUserRole(role);
                setUser({ 
                    loggedIn: true, 
                    email,
                    user_id: decoded.user_id,
                    primary_role: role 
                });
            } else {
                setUser({ loggedIn: true, email });
            }
        }
        setLoading(false);
    }, []);

    const contextData = {
        user,
        userRole,
        authTokens,
        loginUser,
        logoutUser,
        loading
    };

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
