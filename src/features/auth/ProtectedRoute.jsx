import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-luxury-marble">
                <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role) {
        const roles = Array.isArray(role) ? role : [role];
        if (!roles.includes(user?.role)) {
            // If inventory manager tries to access restricted admin area, send to products
            if (user?.role === 'inventory_manager' && location.pathname.startsWith('/admin')) {
                return <Navigate to="/admin/products" replace />;
            }
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
