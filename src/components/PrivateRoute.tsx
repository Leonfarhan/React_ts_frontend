import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const location = useLocation();

  if (!localStorage.getItem('token')) {
    // Redirect to login if not logged in
    return <Navigate to="/" state={{ from: location }} replace />; 
  }

  return <Outlet />; 
};

export default PrivateRoute;