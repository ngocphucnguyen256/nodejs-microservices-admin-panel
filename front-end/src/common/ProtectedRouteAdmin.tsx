import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { AppState } from '../types/index';

interface ProtectedRouteAdminProps {
    children: React.ReactNode;
  }

const ProtectedRouteAdmin = ({ children }: ProtectedRouteAdminProps) => {
  const user = useSelector((state: AppState) => state.auth.user);

const isAdmin = user?.role === "admin";

  return isAdmin ? <>{children}</> : <Navigate to="/auth/signin" />;
};

export default ProtectedRouteAdmin;