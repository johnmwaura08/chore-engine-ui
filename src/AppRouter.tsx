import { Routes, Route } from "react-router";
import LoginMain from "./components/login/LoginMain";
import PrivateRoutes from "./PrivateRoutes";
import { Home } from "./components/chores/Home";
import { useAuthContext } from "context/useAuth";
import { UsersMain } from "components/users/UsersMain";
import React from "react";
import { HistoryGrid } from "components/chores/HistoryGrid";
import { LoadPanel } from "devextreme-react";
import { ChangePasswordForm } from "components/login/ChangePassword";

export const AppRouter = () => {
  const { loginResponse, isAuthenticated, storeLoading } = useAuthContext();

  if (storeLoading) {
    return (
      <LoadPanel
        visible={storeLoading}
        showIndicator
        showPane
        position="center"
      />
    );
  }

  return (
    <Routes>
      <Route
        element={
          <PrivateRoutes
            isAuthenticated={isAuthenticated}
            passwordExpired={loginResponse?.passwordExpired as boolean}
          />
        }
      >
        <Route element={<Home />} path="/" />
        <Route element={<UsersMain />} path="/users" />
        <Route element={<HistoryGrid />} path="/chore-history" />
      </Route>
      <Route element={<LoginMain />} path="/login" />
      <Route element={<ChangePasswordForm />} path="/change-password" />
    </Routes>
  );
};
