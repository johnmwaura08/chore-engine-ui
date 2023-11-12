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
  return !isAuthenticated || passwordExpired ? (
    <Navigate to="/login" />
  ) : (
    <ChoreEngineNavBar>
      <Outlet />
    </ChoreEngineNavBar>
  );
};

export default PrivateRoutes;
