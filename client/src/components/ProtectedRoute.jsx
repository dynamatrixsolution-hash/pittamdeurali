import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('adminToken');

  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render child components
  return <Outlet />;
};

export default ProtectedRoute;
