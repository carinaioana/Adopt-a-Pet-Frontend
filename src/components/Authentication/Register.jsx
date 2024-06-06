import { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PasswordTooltip from "./PasswordTooltip.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    specialChar: false,
    number: false,
    capital: false,
    match: false,
  });

  useEffect(() => {
    setPasswordValidations({
      minLength: password.length >= 8,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      number: /\d/.test(password),
      capital: /[A-Z]/.test(password),
      match: password === confirmPassword,
    });
  }, [password, confirmPassword]);

  const allValidationsPassed =
    Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email && username && allValidationsPassed) {
      try {
        const response = await fetch(
          "https://localhost:7141/api/v1/Authentication/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, username, password, name }),
            secure: false,
          },
        );

        if (response.ok) {
          const data = await response.json(); // Assuming the response includes user info
          localStorage.setItem("authToken", data.token); // Save the token
          localStorage.setItem("userInfo", JSON.stringify(data.user)); // Save user info
          toast.success("Registration successful!");
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1000);
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("An error occurred during registration. Please try again.");
      }
    } else {
      toast.error(
        "Please ensure all fields are correctly filled and all password criteria are met.",
      );
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <ToastContainer />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Name"
        name="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Username"
        name="username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <PasswordTooltip password={password} confirmPassword={confirmPassword}>
        <TextField
          label="Password"
          type="password"
          margin="normal"
          fullWidth
          autoComplete="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </PasswordTooltip>
      <PasswordTooltip password={password} confirmPassword={confirmPassword}>
        <TextField
          label="Confirm Password"
          type="password"
          margin="normal"
          fullWidth
          autoComplete="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </PasswordTooltip>

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign Up
      </Button>
      <Button
        fullWidth
        variant="text"
        sx={{ mt: 1, mb: 2 }}
        onClick={() => navigate("/login")}
      >
        Already have an account? Log in
      </Button>
    </Box>
  );
};

export default Register;
