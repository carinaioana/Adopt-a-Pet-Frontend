import { Spinner, Center } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
};

export default LoadingSpinner;
