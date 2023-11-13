import { useAuthContext } from "context/useAuth";
import { LoginForm } from "./LoginForm";
import { useLocation } from "react-router";
import { Navigate } from "react-router-dom";
import React from "react";

const LoginMain = () => {
  const { loginResponse, isAuthenticated } = useAuthContext();

  // const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  if (!isAuthenticated) {
    return <LoginForm />;
  } else if (isAuthenticated && loginResponse?.passwordExpired) {
    return (
      <div>
        <div>
          <div>Change Password</div>
        </div>
      </div>
    );
  }

  return <Navigate to={from} />;
};

export default LoginMain;
