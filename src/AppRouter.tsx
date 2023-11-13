import { Routes, Route } from "react-router";
import LoginMain from "./components/login/LoginMain";
import PrivateRoutes from "./PrivateRoutes";
import { Home } from "./components/chores/Home";
import { useAuthContext } from "context/useAuth";
import { UsersMain } from "components/users/UsersMain";
import React from "react";
import { HistoryGrid } from "components/chores/HistoryGrid";

export const AppRouter = () => {
  const { loginResponse, isAuthenticated } = useAuthContext();

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
    </Routes>
  );
};
