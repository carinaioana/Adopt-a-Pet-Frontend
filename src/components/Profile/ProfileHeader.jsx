import PropTypes from "prop-types";
import { useState } from "react";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
} from "react-google-places-autocomplete";
import {
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Image,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Flex,
  Box,
  HStack,
  VStack,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { EditIcon, Icon } from "@chakra-ui/icons";
import axios from "axios";
import { useLoading } from "../context/LoadingContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { FaTrash } from "react-icons/fa";
import { MdCake, MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const ProfileHeader = ({ user, onUserUpdate }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    user.userLocation?.selectedLocation || null,
  );
  const { showSuccess, showError } = useNotification();
  const { isLoading, setIsLoading } = useLoading();
  const [openModal, setOpenModal] = useState(false);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const authToken = localStorage.getItem("authToken");
  const baseUrl = "https://localhost:7141";

  const handleLocationChange = (value) => {
    geocodeByPlaceId(value.value.place_id)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        const newLocation = {
          selectedLocation: value.label,
          lat,
          lng,
        };
        onUserUpdate({
          ...user,
          userLocation: newLocation,
        });
        setSelectedLocation(value);
      });
  };
  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };
  const updateEmail = async (userId, newEmail) => {
    const url = `${baseUrl}/api/v1/Authentication/update-email`;
    const data = { userId, newEmail };
    await axios.put(url, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  };

  const updateFullName = async (userId, newName) => {
    const url = `${baseUrl}/api/v1/Authentication/update-name`;
    const data = { userId, newName };
    await axios.put(url, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  };

  const updateUsername = async (userId, newUserName) => {
    const url = `${baseUrl}/api/v1/Authentication/update-username`;
    const data = { userId, newUserName };
    await axios.put(url, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  };

  const updateLocation = async (userId, newLocation) => {
    const url = `${baseUrl}/api/v1/Authentication/update-location`;
    const data = { userId, newLocation };
    await axios.put(url, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  };

  const updateBirthDate = async (userId, newBirthDate) => {
    const url = `${baseUrl}/api/v1/Authentication/update-birthDate`;
    const data = { userId, newBirthDate };
    await axios.put(url, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  };

  const updateDescription = async (userId, newDescription) => {
    const url = `${baseUrl}/api/v1/Authentication/update-description`;
    const data = { userId, newDescription };
    await axios.put(url, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  };

  const updatePhoneNumber = async (userId, newPhoneNumber) => {
    const url = `${baseUrl}/api/v1/Authentication/update-phoneNumber`;
    const data = { userId, newPhoneNumber };
    await axios.put(url, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  };

  const handleSaveChanges = async () => {
    const userId = user.id; // Assuming `user` object has an `id` field
    const baseUrl = "https://localhost:7141";
    let originalUser;
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/Authentication/userinfo/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      originalUser = response.data;
    } catch (error) {
      showError("Failed to fetch original user details:", error);
      return;
    }

    try {
      setIsLoading(true);

      if (user?.email !== originalUser?.email) {
        await updateEmail(userId, user.email);
      }

      if (user?.fullName !== originalUser?.fullName) {
        await updateFullName(userId, user.fullName);
      }

      if (user?.username !== originalUser?.username) {
        await updateUsername(userId, user.username);
      }

      if (
        user?.userLocation?.selectedLocation !==
        originalUser?.userLocation?.selectedLocation
      ) {
        await updateLocation(userId, user.userLocation.selectedLocation);
      }

      if (user?.birthDate !== originalUser?.birthDate) {
        const birthDate = new Date(user.birthDate);
        if (!isNaN(birthDate.getTime())) {
          await updateBirthDate(userId, birthDate.toISOString());
        } else {
          showError("Invalid birth date");
          return;
        }
      }

      if (user?.description !== originalUser?.description) {
        await updateDescription(userId, user.description);
      }

      if (user?.phoneNumber !== originalUser?.phoneNumber) {
        await updatePhoneNumber(userId, user.phoneNumber);
      }

      showSuccess("All updates successful");
    } catch (error) {
      showError("Failed to update user details:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangePhoto = async (e) => {
    const newPhoto = e.target.files[0];
    setNewProfilePhoto(newPhoto);

    const formData = new FormData();
    formData.append("UserId", user.id);
    formData.append("NewProfilePhotoUrl", user.profilePhoto);
    formData.append("ImageFile", newPhoto);

    try {
      setIsLoading(true);
      const authToken = localStorage.getItem("authToken");
      const response = await axios.put(
        "https://localhost:7141/api/v1/Authentication/update-profilePhoto",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      const updatedUser = {
        ...user,
        profilePhoto: response.data.newProfilePhotoUrl,
      };
      onUserUpdate(updatedUser);
      setUser(updatedUser);
      showSuccess("Profile photo updated successfully");
    } catch (error) {
      showError("Failed to update profile photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    const formData = new FormData();
    formData.append("UserId", user.id);
    formData.append("NewProfilePhotoUrl", ""); // Empty string to indicate deletion
    formData.append("ImageFile", ""); // No new image file

    try {
      setIsLoading(true);
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        "https://localhost:7141/api/v1/Authentication/update-profilePhoto",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      onUserUpdate({ ...user, profilePhoto: "" });
      showSuccess("Profile photo deleted successfully");
    } catch (error) {
      showError("Failed to delete profile photo:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (!user) {
    return <LoadingSpinner />;
  }
  return (
    <>
      {isLoading && <LoadingSpinner />}
      {user && (
        <Container
          maxW={[
            "100%",
            "container.sm",
            "container.md",
            "container.lg",
            "container.xl",
          ]}
          p={[2, 3, 4]}
          mt={[2, 4, 8]}
          borderRadius="md"
          boxShadow="md"
        >
          <Card variant="outline" width="100%">
            <CardBody>
              <Stack
                direction={["column", "row"]}
                spacing={[4, 4, 6]}
                align="center"
                justify="center"
              >
                <Flex direction="column" align="center">
                  <Box
                    width={["150px", "175px", "200px"]}
                    height={["150px", "175px", "200px"]}
                    borderRadius="full"
                    overflow="hidden"
                    position="relative"
                    mb={4}
                  >
                    <Image
                      src={user?.profilePhoto || ""}
                      alt="profile-photo"
                      objectFit="cover"
                      width="100%"
                      height="100%"
                    />
                    <IconButton
                      icon={<EditIcon />}
                      aria-label="Edit Profile Photo"
                      onClick={() => setOpenPhotoModal(true)}
                      position="absolute"
                      top="15%"
                      right="15%"
                      isRound
                      bg="blackAlpha.600"
                      color="white"
                      size="sm"
                      _hover={{
                        bg: "blackAlpha.800",
                      }}
                      _active={{
                        bg: "none",
                      }}
                      _focus={{
                        outline: "none",
                        boxShadow: "none",
                      }}
                    />
                  </Box>
                  <Box mb="4">
                    <Heading
                      as="h4"
                      size="lg"
                      textAlign="center"
                      isTruncated
                      maxWidth="100%"
                    >
                      {user.fullName || ""}
                    </Heading>
                    <Text fontSize="xl" isTruncated maxWidth="100%">
                      @{user.username}
                    </Text>
                  </Box>
                  <Button
                    colorScheme="blue"
                    onClick={handleToggleModal}
                    width="full"
                  >
                    Edit Profile
                  </Button>
                </Flex>
                <VStack
                  align="center"
                  justify="center"
                  spacing={3}
                  width="full"
                >
                  <Heading
                    as="h4"
                    size={["md", "lg", "xl"]}
                    textAlign="center"
                    isTruncated
                    maxWidth="100%"
                    mb={4}
                  >
                    My Profile
                  </Heading>
                  <Text
                    fontSize={["sm", "md", "lg"]}
                    textAlign="center"
                    noOfLines={2}
                    maxWidth="100%"
                  >
                    {user.description}
                  </Text>
                  <VStack
                    spacing={2}
                    width="full"
                    align="center"
                    justify="center"
                  >
                    <HStack width="full" justify="center">
                      <Icon
                        as={MdEmail}
                        flexShrink={0}
                        fontSize={["sm", "md", "lg"]}
                      />
                      <Text
                        fontSize={["xs", "sm", "md"]}
                        isTruncated
                        maxWidth="calc(100% - 24px)"
                        textAlign="center"
                      >
                        {user.email}
                      </Text>
                    </HStack>
                    <HStack width="full" justify="center">
                      <Icon
                        as={MdCake}
                        flexShrink={0}
                        fontSize={["sm", "md", "lg"]}
                      />
                      <Text
                        fontSize={["xs", "sm", "md"]}
                        isTruncated
                        maxWidth="calc(100% - 24px)"
                        textAlign="center"
                      >
                        {calculateAge(user.birthDate)} years old
                      </Text>
                    </HStack>
                    <HStack width="full" justify="center">
                      <Icon
                        as={MdLocationOn}
                        flexShrink={0}
                        fontSize={["sm", "md", "lg"]}
                      />
                      <Text
                        fontSize={["xs", "sm", "md"]}
                        isTruncated
                        maxWidth="calc(100% - 24px)"
                        textAlign="center"
                      >
                        {user.userLocation.selectedLocation}
                      </Text>
                    </HStack>
                    <HStack width="full" justify="center">
                      <Icon
                        as={MdPhone}
                        flexShrink={0}
                        fontSize={["sm", "md", "lg"]}
                      />
                      <Text
                        fontSize={["xs", "sm", "md"]}
                        isTruncated
                        maxWidth="calc(100% - 24px)"
                        textAlign="center"
                      >
                        {user.phoneNumber}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Stack>
            </CardBody>
          </Card>
          <Modal isOpen={openModal} onClose={handleToggleModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit User Details</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) =>
                      onUserUpdate({ ...user, email: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    id="fullName"
                    type="text"
                    value={user.fullName || ""}
                    onChange={(e) =>
                      onUserUpdate({ ...user, fullName: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    id="username"
                    type="text"
                    value={user.username}
                    onChange={(e) =>
                      onUserUpdate({ ...user, username: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Location</FormLabel>
                  <GooglePlacesAutocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                    selectProps={{
                      value: selectedLocation,
                      onChange: handleLocationChange,
                    }}
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        padding: "10px",
                        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                      }),
                      input: (provided) => ({
                        ...provided,
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        color: "black",
                        fontSize: "16px",
                        padding: "10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }),
                    }}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Birth Date</FormLabel>
                  <Input
                    id="birthDate"
                    type="date"
                    value={user.birthDate}
                    onChange={(e) =>
                      onUserUpdate({ ...user, birthDate: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    id="description"
                    value={user.description}
                    onChange={(e) =>
                      onUserUpdate({ ...user, description: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={user.phoneNumber}
                    onChange={(e) =>
                      onUserUpdate({ ...user, phoneNumber: e.target.value })
                    }
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleToggleModal}>Cancel</Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    onUserUpdate({
                      ...user,
                      email: user.email,
                      fullName: user.fullName,
                      username: user.username,
                      userLocation: {
                        selectedLocation: selectedLocation.label,
                      },
                      birthDate: user.birthDate,
                      description: user.description,
                      phoneNumber: user.phoneNumber,
                    });
                    handleSaveChanges();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal
            isOpen={openPhotoModal}
            onClose={() => setOpenPhotoModal(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Change Profile Photo</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Upload new photo</FormLabel>
                  <Input type="file" onChange={handleChangePhoto} />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => setOpenPhotoModal(false)}
                >
                  Close
                </Button>
                <IconButton
                  colorScheme="red"
                  aria-label="Delete photo"
                  icon={<FaTrash />}
                  onClick={handleDeletePhoto}
                  mr={3}
                />
                <Button colorScheme="green" onClick={handleChangePhoto}>
                  Save New Photo
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      )}
    </>
  );
};

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string,
    username: PropTypes.string,
    userLocation: PropTypes.object,
    selectedLocation: PropTypes.string,
    profilePhoto: PropTypes.string,
    description: PropTypes.string,
    email: PropTypes.string,
    age: PropTypes.number,
  }).isRequired,
  onUserUpdate: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default ProfileHeader;
