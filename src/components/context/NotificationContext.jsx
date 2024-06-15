import React, { createContext, useContext, useCallback } from "react";
import { useToast } from "@chakra-ui/react";

// Create the context
const NotificationContext = createContext(null);

// Create a provider component
export const NotificationProvider = ({ children }) => {
  const toast = useToast();

  const showSuccess = useCallback(
    (message) => {
      toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    [toast],
  );

  const showError = useCallback(
    (message) => {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    [toast],
  );

  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};
