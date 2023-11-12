import { Routes, Route } from "react-router";
import LoginMain from "./components/login/LoginMain";
import PrivateRoutes from "./PrivateRoutes";
import { Home } from "./components/Home";

export const AppRouter = () => {
  const isAuthenticated = true;
  const passwordExpired = false;
  return (
    <Routes>
      <Route
        element={
          <PrivateRoutes
            isAuthenticated={isAuthenticated}
            passwordExpired={passwordExpired}
          />
        }
      >
        <Route element={<Home />} path="/" />
      </Route>
      <Route element={<LoginMain />} path="/login" />
    </Routes>
  );
};
