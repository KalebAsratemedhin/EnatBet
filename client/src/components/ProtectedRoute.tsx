import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('user'); // simple mock check
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
