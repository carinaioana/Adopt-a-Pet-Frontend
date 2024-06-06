import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CircularProgress } from "@mui/material"; // Corrected import statement

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("isDarkMode")) || false,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // State to trigger re-render

  const getTokenExpiration = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000; // Convert to milliseconds
  };

  const fetchUserDetails = useCallback(async (token) => {
    try {
      const userDetailsResponse = await axios.get(
        "https://localhost:7141/api/v1/Authentication/currentuserinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const claims = userDetailsResponse.data.claims;
      const userId =
        claims[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const response = await axios.get(
        `https://localhost:7141/api/v1/Authentication/userinfo/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const userDetails = {
        id: userId,
        username: response.data.userName,
        name: response.data.name,
        email: response.data.email,
      };

      setUserDetails(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (token) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    await fetchUserDetails(token); // Ensure user details are fetched before proceeding
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUserDetails(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    localStorage.setItem("isDarkMode", JSON.stringify(!isDarkMode));
  };

  const checkTokenExpiry = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const tokenExpiry = getTokenExpiration(token);
      const now = new Date().getTime();

      if (now >= tokenExpiry) {
        logout();
      }
      console.log("Token expires in:", (tokenExpiry - now) / 1000, "seconds");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
      fetchUserDetails(token);
    } else {
      setIsLoading(false);
    }

    const interval = setInterval(() => {
      checkTokenExpiry();
    }, 6000); // Check every minute

    return () => clearInterval(interval);
  }, [fetchUserDetails]);

  const triggerRefresh = useCallback(() => {
    window.location.reload(); // Refresh the page
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        authToken,
        isDarkMode,
        userDetails,
        toggleDarkMode,
        isLoading,
        triggerRefresh,
      }}
    >
      {isLoading ? (
        <CircularProgress>Loading...</CircularProgress> // Show a loading indicator while fetching user details
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
