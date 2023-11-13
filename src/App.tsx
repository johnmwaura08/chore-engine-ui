import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "context/useAuth";
import React from "react";
import Footer from "Footer";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
        <Footer />
      </AuthProvider>
      <ToastContainer limit={3} />
    </Router>
  );
}

export default App;
