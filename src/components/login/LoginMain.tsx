import { useAuthContext } from "context/useAuth";
import { LoginForm } from "./LoginForm";
import { useLocation } from "react-router";
import { Navigate } from "react-router-dom";
import React from "react";
import { Change } from "devextreme-react/data-grid";
import { ChangePasswordForm } from "./ChangePassword";

const LoginMain = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  const { from, isAuthenticated, passwordExpired } = location.state || {
    from: { pathname: "/" },
    isAuthenticated: false,
    passwordExpired: false,
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  } else if (isAuthenticated && passwordExpired) {
    return <ChangePasswordForm />;
  }

  return <Navigate to={from} />;
};

export default LoginMain;
