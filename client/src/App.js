import React, { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import MenuAppBar from "./components/Menu";
import Carousel from "./components/Carousel";
import Message from "./components/Message";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ClientDash from "./components/ClientDashboard";
import PasswordResetForm from "./components/PasswordResetForm";

import AdminPanel from "./Admin/Main.tsx";
import Reset from "./Admin/Reset.tsx";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🟢 Check authentication status on initial load
  const checkAuthStatus = useCallback(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <Router>
      <div
        className="App"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Top navigation bar */}
        <MenuAppBar />

        {/* Main content */}
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Home route: public access */}
            <Route
              path="/"
              element={
                <>
                  <Carousel />
                  <Message />
                </>
              }
            />

            {/* Auth-only routes */}
            {!isAuthenticated && (
              <Route path="/login" element={<LoginForm />} />
            )}
            {!isAuthenticated && (
              <Route path="/signup" element={<SignupForm />} />
            )}
            {!isAuthenticated && (
              <Route path="/reset-password" element={<PasswordResetForm />} />
            )}

            {/* Protected user dashboard */}
            {isAuthenticated && (
              <Route path="/dashboard" element={<ClientDash />} />
            )}

            {/* Admin routes (optional auth logic can be added) */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/adr" element={<Reset />} />

            {/* Catch-all route redirection */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />}
            />
          </Routes>
        </div>

        {/* Footer always at bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
