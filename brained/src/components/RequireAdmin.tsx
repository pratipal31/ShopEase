import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let auth: any = null;
  try { auth = useAuth(); } catch (e) { auth = null; }
  const location = useLocation();

  if (!auth || !auth.user) {
    // not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (auth.user.role !== 'admin') {
    // forbidden
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default RequireAdmin;
