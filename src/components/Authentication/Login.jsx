import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext.jsx";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showSuccess, showError } = useNotification();
  const { login, userDetails } = useAuth();
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgGradient = useColorModeValue(
    "linear(to-r, orange.100, orange.50)",
    "linear(to-r, blue.900, blue.700)",
  );

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
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
        showSuccess("Login successful!");

        navigate("/profile", { replace: true });
      } else {
        showError("Invalid username or password.");
      }
    } catch (error) {
      showError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}{" "}
      <Flex height="100%" justifyItems="center" justifyContent="center">
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
            Login
          </Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing="1rem">
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>
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
                      bg="ghost"
                      h="1.75rem"
                      size="sm"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                colorScheme="blue"
                variant="solid"
                type="submit"
                onClick={handleSubmit}
              >
                Sign In
              </Button>
              <Text align="center">
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => navigate("/register")}
                >
                  Don't have an account?
                </Button>
              </Text>
            </Stack>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default Login;
