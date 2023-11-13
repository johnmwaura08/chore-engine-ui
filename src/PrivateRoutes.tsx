import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { ChoreEngineNavBar } from "./components/AppBar";

const PrivateRoutes = ({
  isAuthenticated,
  passwordExpired,
}: {
  isAuthenticated: boolean;
  passwordExpired: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
}) => {
  if (!isAuthenticated)
    return (
      <Navigate
        to="/login"
        state={{
          from: window.location.pathname,
          isAuthenticated: isAuthenticated,
          passwordExpired: passwordExpired,
        }}
      />
    );
  else if (isAuthenticated && passwordExpired)
    return (
      <Navigate
        to="/change-password"
        state={{
          from: window.location.pathname,
          isAuthenticated: isAuthenticated,
          passwordExpired: passwordExpired,
        }}
      />
    );

  return (
    <ChoreEngineNavBar>
      <Outlet />
    </ChoreEngineNavBar>
  );
};

export default PrivateRoutes;
