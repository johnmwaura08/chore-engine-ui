import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({
  isAuthenticated,
  redirectPath = "/",
  children,
  passwordExpired,
}: {
  isAuthenticated: boolean;
  passwordExpired: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (isAuthenticated && !passwordExpired) {
    return <Navigate to="/change-password" replace />;
  }

  return children ? children : <Outlet />;
};
