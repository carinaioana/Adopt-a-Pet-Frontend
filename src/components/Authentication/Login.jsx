import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
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
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
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
      {isLoading && <LoadingSpinner />}
      <Flex
        height="100%"
        justifyContent="center"
        alignItems="center"
        px={{ base: "0.5rem", md: "0" }}
      >
        <Box
          mt={{ base: "1rem", md: "2rem" }}
          borderWidth={1}
          px={{ base: 4, sm: 6, md: 8 }}
          py={{ base: 8, md: 12 }}
          rounded="2xl"
          shadow="lg"
          bg="white"
          w={{ base: "2xs", sm: "md", md: "lg" }}
          maxW="xl"
          bgGradient={bgGradient}
        >
          <Heading
            mb={{ base: 4, md: 6 }}
            textAlign="center"
            fontSize={{ base: "xl", md: "2xl" }}
          >
            Login
          </Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing={{ base: "0.75rem", md: "1rem" }}>
              <FormControl id="username" isRequired>
                <FormLabel fontSize={{ base: "sm", md: "md" }}>
                  Username
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size={{ base: "sm", md: "md" }}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel fontSize={{ base: "sm", md: "md" }}>
                  Password
                </FormLabel>
                <InputGroup size={{ base: "sm", md: "md" }}>
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
                size={{ base: "sm", md: "md" }}
              >
                Sign In
              </Button>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mb={4}
                flexDirection={{ base: "column", sm: "row" }}
                gap={{ base: 2, sm: 0 }}
              >
                <Checkbox colorScheme="cyan" size={{ base: "sm", md: "md" }}>
                  Remember Me
                </Checkbox>
                <Button
                  colorScheme="blue"
                  variant="ghost"
                  size={{ base: "xs", md: "sm" }}
                  onClick={() =>
                    console.log("Navigate to Forgot Password page")
                  }
                  _focus={{ outline: "none" }}
                >
                  Forgot Password?
                </Button>
              </Flex>
              <Text align="center">
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => navigate("/register")}
                  size={{ base: "sm", md: "md" }}
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
