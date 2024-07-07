import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Announcements from "./components/Announcements/Announcements.jsx";
import About from "./components/About.jsx";
import { Box, Flex } from "@chakra-ui/react";
import Login from "./components/Authentication/Login.jsx";
import { useAuth } from "./components/context/AuthContext.jsx";
import PropTypes from "prop-types";
import Register from "./components/Authentication/Register.jsx";
import PetDetailsPage from "./components/PetMedicalHistory.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { AuthProvider } from "./components/context/AuthContext.jsx";
import AnnouncementDetails from "./components/Announcements/AnnouncementDetails.jsx";

const App = () => {
  const { authToken, isDarkMode, toggleDarkMode, isLoading } = useAuth();
  const isLoggedIn = !!authToken;

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <Box
      as="div"
      id="root"
      minHeight="100vh"
      width="100vw"
      padding={{ base: "20px", sm: "40px", md: "80px" }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      overflow="hidden"
    >
      <BrowserRouter>
        <Header
          onThemeToggle={toggleDarkMode} // Updated to use toggleDarkMode from context
          isDarkMode={isDarkMode} // Updated to use isDarkMode from context
          isLoggedIn={isLoggedIn}
        />
        <Box flex="1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/announcement/:id" element={<AnnouncementDetails />} />

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
        </Box>
        <Footer />
      </BrowserRouter>
    </Box>
  );
};

export default App;
