import { useEffect, useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useAuth } from "./context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import PasswordTooltip from "./PasswordTooltip.jsx";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();
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
              body: JSON.stringify({ email, username, password }),
              secure: false,
            },
          );

          if (response.ok) {
            const data = await response.json(); // Assuming the response includes user info
            localStorage.setItem("authToken", data.token); // Save the token
            localStorage.setItem("userInfo", JSON.stringify(data.user)); // Save user info
            navigate("/", { replace: true });
            alert("Registration successful!");
          } else {
            alert("Registration failed. Please try again.");
          }
        } catch (error) {
          console.error("Registration error:", error);
          alert("An error occurred during registration. Please try again.");
        }
      } else {
        alert(
          "Please ensure all fields are correctly filled and all password criteria are met.",
        );
      }
    };
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
    </Box>
  );
};

export default Register;
