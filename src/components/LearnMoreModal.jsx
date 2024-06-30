import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Heading,
  Box,
  Button,
  VStack,
  Text,
} from "@chakra-ui/react";

function LearnMoreModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Our Similarity Algorithm</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Our advanced similarity algorithm serves two primary purposes:
          </Text>
          <VStack align="start" spacing={4}>
            <Box>
              <Heading size="sm" mb={2}>
                1. Find Your Lost Pet
              </Heading>
              <Text>
                If you've lost your pet, you can use our algorithm to search
                through our announcements. Upload a photo of your lost pet, and
                we'll scan our database to find similar-looking animals that
                have been reported found.
              </Text>
            </Box>
            <Box>
              <Heading size="sm" mb={2}>
                2. Find a Pet That Looks Like Your Photo
              </Heading>
              <Text>
                Maybe you're looking to adopt a pet that resembles a beloved
                former pet or a specific breed. Simply upload a photo, and our
                algorithm will match you with available pets that look similar
                to your image.
              </Text>
            </Box>
          </VStack>
          <Text mt={4}>
            This powerful tool increases the chances of reuniting lost pets with
            their owners and helps adopters find pets that match their
            preferences.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default LearnMoreModal;
