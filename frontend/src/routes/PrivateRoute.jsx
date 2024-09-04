import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role) && !(role === 'master_admin' && allowedRoles.includes('admin'))) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;









