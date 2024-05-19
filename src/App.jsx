import { useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./styles/App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Announcements from "./components/Announcements/Announcements.jsx";
import About from "./components/About.jsx";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "./theme";
import Login from "./components/Authentication/Login.jsx";
import { useAuth } from "./components/Authentication/context/AuthContext.jsx";
import PropTypes from "prop-types";
import Register from "./components/Authentication/Register.jsx";
import PetDetailsPage from "./components/PetMedicalHistory.jsx";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isLoggedIn } = useAuth();

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Header
          onThemeToggle={toggleTheme}
          isDarkMode={isDarkMode}
          isLoggedIn={isLoggedIn}
        />
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pet-details/:petId"
              element={
                <ProtectedRoute>
                  <PetDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/announcements"
              element={
                <ProtectedRoute>
                  <Announcements />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
