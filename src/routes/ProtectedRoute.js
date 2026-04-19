import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, userRole, loading } = useAuth();

    if (loading) {
        return null;
    }

    const isAuthenticated = user || localStorage.getItem('access_token');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        if (userRole === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
        if (userRole === 'PROFESSOR') return <Navigate to="/instructor/dashboard" replace />;
        if (userRole === 'TA') return <Navigate to="/ta/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
