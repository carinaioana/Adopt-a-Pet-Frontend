import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Container,
  Heading,
  Flex,
  VStack,
  Image,
  List,
  ListItem,
  useColorModeValue, ModalCloseButton, ModalContent, ModalOverlay,  useDisclosure, Modal, Button
} from "@chakra-ui/react";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner.jsx";
import {ArrowBackIcon} from "@chakra-ui/icons";

const AnnouncementDetails = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('white', 'gray.700');
  const titleColor = useColorModeValue('purple.500', 'purple.300');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
  // Assuming the token is stored in localStorage
  const authToken = localStorage.getItem("authToken");

  const response = await axios.get(`https://localhost:7141/api/v1/Announc/${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  setAnnouncement(response.data);
  console.log(response.data);

  // After fetching announcement, fetch user details
  const userResponse = await axios.get(`https://localhost:7141/api/v1/Authentication/userinfo/${response.data.createdBy}`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  setUserInfo(userResponse.data);
  console.log(userResponse.data);
} catch (error) {
  console.error("Error fetching announcement or user info:", error);
} finally {
  setIsLoading(false);
}
    };

    fetchAnnouncement();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!announcement) {
    return <Text fontSize="lg" fontWeight="bold">No announcement found.</Text>;
  }

  return (
<Container maxW="4xl" centerContent py={8}>
  <Box bg={bgColor} p={8} shadow="2xl" borderWidth="1px" borderRadius="lg" overflow="hidden" w="full" position="relative">
    <Box display={{ base: "none", md: "block" }} position="absolute" top="4" right="4" zIndex="2">
      <Button
          onClick={() => window.history.back()}
          size="sm"
          colorScheme="blue"
          variant="ghost"
          leftIcon={<ArrowBackIcon />}
      >
        Back
      </Button>
    </Box>
    <Box display={{ base: "block", md: "none" }} position="absolute" bottom="4" right="4" zIndex="2" mt={8}>
      <Button
          onClick={() => window.history.back()}
          size="sm"
          colorScheme="blue"
          variant="ghost"
          leftIcon={<ArrowBackIcon />}
      >
        Back
      </Button>
    </Box>
    <VStack align="start" spacing={6} maxWidth="100%" w="full" textAlign={{ base: "center", md: "left" }}>
      <Heading as="h2" size="xl" mb={4} color={titleColor} textTransform="uppercase" letterSpacing="wide">
        {announcement.announcementTitle}
      </Heading>
      {userInfo && (
       <Flex alignItems="center" justifyContent="space-between" w="full">
  <Flex alignItems="center">
    <Image borderRadius="full" boxSize="50px" src={userInfo.profilePhoto} alt={userInfo.name} mr={4} />
    <Text fontWeight="bold">{userInfo.name}</Text>
  </Flex>
  <Button colorScheme="blue" variant="outline" onClick={() => setIsPhoneVisible(!isPhoneVisible)}>
    {isPhoneVisible ? userInfo.phoneNumber : 'Show Phone Number'}
  </Button>
</Flex>
      )}
      <Flex direction={{ base: "column", md: "row" }} w="full" alignItems="center">
        <Box flexShrink={0} mr={{ base: 0, md: 8 }} mb={{ base: 8, md: 0 }} width={{ base: "100%", md: "50%" }} cursor="pointer" onClick={onOpen}>
          <Image borderRadius="lg" src={announcement.imageUrl} alt="Animal photo" objectFit="cover" w="full" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <Image src={announcement.imageUrl} alt="Animal photo" objectFit="contain" w="100%" h="100%" />
            </ModalContent>
          </Modal>
        </Box>
        <VStack align="start" spacing={6} maxWidth="100%" width={{ md: "50%" }}>
          <Flex justifyContent="space-between" w="full" flexDirection={{ base: "column", md: "row" }} alignItems={{ base: "center", md: "flex-start" }}>
            <Text fontSize="lg" color="gray.500">
              {new Date(announcement.announcementDate).toLocaleDateString("en-UK")}
            </Text>
            <Text fontSize="lg" color="gray.500">
              {announcement.location}
            </Text>
          </Flex>
          <List spacing={3} w="full">
            <ListItem fontSize="lg">Type: <Text as="span" fontWeight="bold">{announcement.animalType}</Text></ListItem>
            <ListItem fontSize="lg">Breed: <Text as="span" fontWeight="bold">{announcement.animalBreed}</Text></ListItem>
            <ListItem fontSize="lg">Gender: <Text as="span" fontWeight="bold">{announcement.animalGender}</Text></ListItem>
          </List>
          <Text fontSize="lg" color={textColor} w="full">
            {announcement.announcementDescription.split(', ').map((item, index) => (
              <Text as="span" key={index} display="block" mb={2}>{item}</Text>
            ))}
          </Text>
        </VStack>
      </Flex>
    </VStack>
  </Box>
</Container>
  );
};

export default AnnouncementDetails;