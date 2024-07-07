import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { AuthProvider } from "./components/context/AuthContext.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { LoadingProvider } from "./components/context/LoadingContext.jsx";
import { NotificationProvider } from "./components/context/NotificationContext.jsx";
import theme from "./theme.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <NotificationProvider>
        <LoadingProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LoadingProvider>
      </NotificationProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
