import { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useAuth } from "./context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
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
        // Login successful, handle the token as needed
        localStorage.setItem("authToken", token);
        login(token);
        navigate("/", { replace: true });
        alert("Login successful!");
      } else {
        // Login failed, handle the error
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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