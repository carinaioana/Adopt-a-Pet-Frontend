import { memo } from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer = memo(function Footer() {
  return (
    <Box as="footer" width="full" py="4" textAlign="center" flexShrink={0}>
      <Text>&copy; Adopt A Pet {new Date().getFullYear()}</Text>
    </Box>
  );
});

export default Footer;
