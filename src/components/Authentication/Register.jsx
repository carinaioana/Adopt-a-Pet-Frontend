import { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import PasswordTooltip from "./PasswordTooltip.jsx";
import { useLoading } from "../context/LoadingContext.jsx";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const { isLoading, setIsLoading } = useLoading();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    specialChar: false,
    number: false,
    capital: false,
    match: false,
  });
  const { colorMode, toggleColorMode } = useColorMode();
  const bgGradient = useColorModeValue(
    "linear(to-r, orange.100, orange.50)",
    "linear(to-r, blue.900, blue.700)",
  );

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

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email && username && allValidationsPassed) {
      try {
        setIsLoading(true);
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
          showSuccess(
            "Registration successful! \nYou will now be redirected to the login page.",
          );
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 1000);
        } else {
          showError("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        showError("An error occurred during registration. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      showError("Please complete all the required fields");
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}{" "}
      <Flex height="100%">
        <Box
          mt="2rem"
          borderWidth={1}
          px={8}
          py={12}
          rounded="md"
          shadow="lg"
          bg="white"
          minW="md"
          maxW="lg"
          bgGradient={bgGradient}
        >
          <Heading mb={6} textAlign="center">
            Register
          </Heading>
          <Stack spacing="1rem">
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <PasswordTooltip
              password={password}
              confirmPassword={confirmPassword}
            >
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <Button
                      h="1.75rem"
                      size="sm"
                      bg="ghost"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </PasswordTooltip>
            <PasswordTooltip
              password={password}
              confirmPassword={confirmPassword}
            >
              <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <Button
                      h="1.75rem"
                      size="sm"
                      bg="ghost"
                      onClick={handleClickShowConfirmPassword}
                    >
                      {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </PasswordTooltip>
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={handleSubmit}
              isFullWidth
            >
              Sign Up
            </Button>
            <Text align="center">
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Already have an account? Log in
              </Button>
            </Text>
          </Stack>
        </Box>
        <ToastContainer />
      </Flex>
    </>
  );
};

export default Register;
