import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, triggerRefresh } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://localhost:7141/api/v1/Authentication/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          secure: false,
        },
      );

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("authToken", token);
        await login(token);
        toast.success("Login successful!");
        navigate("/", { replace: true });
        triggerRefresh();
      } else {
        toast.error("Invalid username or password.");
      }
    } catch (error) {
      toast.error("An error occurred during login. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <ToastContainer />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign In
      </Button>
      <Button
        fullWidth
        variant="text"
        sx={{ mt: 1, mb: 2 }}
        onClick={() => {
          navigate("/register"); // Adjust the path as necessary based on your routing setup
        }}
      >
        Don&apos;t have an account? Register
      </Button>
    </Box>
  );
};

export default Login;
