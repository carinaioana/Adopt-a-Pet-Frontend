import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import statement
import {
  Button,
  CircularProgress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDarkMode, setIsDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("isDarkMode")) || false,
  );
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const getTokenExpiration = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000; // Convert to milliseconds
  };
  const fetchUserDetails = useCallback(
    async (token) => {
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
          phoneNumber: response.data.phoneNumber,
          location: response.data.location,
          profilePhoto: response.data.profilePhoto,
          description: response.data.description,
          birthDate: response.data.birthDate,
        };

        console.log("Updating userDetails:", userDetails);
        setUserDetails(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast({
          title: "Error fetching user details",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [authToken],
  );
  const login = (token) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    fetchUserDetails(token);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUserDetails(null);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("isDarkMode", JSON.stringify(newMode));
  };

  const checkTokenExpiry = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const tokenExpiry = getTokenExpiration(token);
      const now = new Date().getTime();

      if (now >= tokenExpiry) {
        logout();
        onOpen();
      }
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
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [fetchUserDetails, onOpen]);

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
      }}
    >
      {isLoading ? (
        <CircularProgress isIndeterminate color="green.300" />
      ) : (
        children
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Session Expired</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Your session has expired. Please log in again.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
