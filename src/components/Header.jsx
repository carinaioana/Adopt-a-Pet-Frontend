import {
  Flex,
  Heading,
  Spacer,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import NavDrawer from "./NavDrawer.jsx";

const Header = ({ isLoggedIn }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={{ base: "1rem", md: "1.5rem" }} // Adjust padding for mobile
      bg={colorMode === "light" ? "gray.100" : "gray.800"}
      color={colorMode === "light" ? "gray.600" : "gray.200"}
      boxShadow="md"
      width="100%" // This line makes the Flex component stretch the whole width
    >
      <Heading as="h1" size="lg" letterSpacing={"-.1rem"} onClick={() => window.location.href = "/"}>
        Adopt A Pet
      </Heading>
      <Spacer />

      <NavDrawer
        isOpen={isOpen}
        onClose={onClose}
        isLoggedIn={isLoggedIn}
        colorMode={colorMode}
      />
    </Flex>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Header;
