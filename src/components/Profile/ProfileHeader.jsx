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
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useLoading } from "../context/LoadingContext.jsx";

const ProfileHeader = ({ user, onUserUpdate }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    user.userLocation.selectedLocation,
  );
  const { isLoading, setIsLoading } = useLoading();
  const [openModal, setOpenModal] = useState(false);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);

  const handleLocationChange = (value) => {
    geocodeByPlaceId(value.value.place_id)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        onUserUpdate({
          ...user,
          userLocation: { selectedLocation: value.label },
        });
      });
    setSelectedLocation(value);
  };
  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleSaveChanges = async () => {
    const userId = user.id; // Assuming `user` object has an `id` field
    const baseUrl = "https://localhost:7141";
    const originalUser = {
      /* retrieve the original user data for comparison */
    };

    const updateEndpoints = [];

    if (user?.email !== originalUser?.email) {
      updateEndpoints.push({
        url: `${baseUrl}/api/v1/Authentication/update-email`,
        data: { userId, newEmail: user.email },
      });
    }

    if (user?.fullName !== originalUser?.fullName) {
      updateEndpoints.push({
        url: `${baseUrl}/api/v1/Authentication/update-name`,
        data: { userId, newName: user.fullName },
      });
    }

    if (user?.username !== originalUser?.username) {
      updateEndpoints.push({
        url: `${baseUrl}/api/v1/Authentication/update-username`,
        data: { userId, newUserName: user.username },
      });
    }

    if (
      user?.userLocation?.selectedLocation !==
      originalUser?.userLocation?.selectedLocation
    ) {
      updateEndpoints.push({
        url: `${baseUrl}/api/v1/Authentication/update-location`,
        data: { userId, newLocation: user.userLocation.selectedLocation },
      });
    }

    if (user?.birthDate !== originalUser?.birthDate) {
      updateEndpoints.push({
        url: `${baseUrl}/api/v1/Authentication/update-birthDate`,
        data: { userId, newBirthDate: user.birthDate },
      });
    }

    if (user?.description !== originalUser?.description) {
      updateEndpoints.push({
        url: `${baseUrl}/api/v1/Authentication/update-description`,
        data: { userId, newDescription: user.description },
      });
    }

    if (user?.phoneNumber !== originalUser?.phoneNumber) {
      updateEndpoints.push({
        url: `${baseUrl}/api/v1/Authentication/update-phoneNumber`,
        data: { userId, newPhoneNumber: user.phoneNumber },
      });
    }
    const authToken = localStorage.getItem("authToken");
    try {
      setIsLoading(true);
      await Promise.all(
        updateEndpoints.map(({ url, data }) =>
          axios.put(url, data, {
            headers: {
              Authorization: `Bearer ${authToken}`, // Replace yourTokenVariable with the actual token variable
            },
          }),
        ),
      );

      // If there's a new profile photo, upload it
      if (newProfilePhoto && newProfilePhoto !== originalUser.profilePhoto) {
        const formData = new FormData();
        formData.append("UserId", userId);
        formData.append("ImageFile", newProfilePhoto);
        formData.append("NewProfilePhotoUrl", user.profilePhoto);

        await axios.post(
          `${baseUrl}/api/v1/Authentication/update-profilePhoto`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      console.log("All updates successful");
    } catch (error) {
      console.error("Failed to update user details:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container
      maxW={["container.sm", "container.md", "container.lg", "container.xl"]}
      p={4}
      mt={[2, 4, 8]}
      borderRadius="md"
      boxShadow="md"
    >
      <Card variant="outline">
        <CardBody position="relative" display="flex" justifyContent="center">
          <Image
            src={user.profilePhoto}
            alt="profile-photo"
            boxSize={["150px", "175px", "200px", "225px", "250px"]} // Responsive box size
            borderRadius="full"
            position="relative"
            _hover={{
              "& .edit-icon": {
                display: "block",
              },
            }}
            onClick={() => setOpenPhotoModal(true)}
          />
          <IconButton
            className="edit-icon"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            display="none"
            onClick={() => setOpenPhotoModal(true)}
            aria-label={"Edit Profile"}
          >
            <EditIcon color="primary" />
          </IconButton>
        </CardBody>
        <Heading as="h4" size="md" mb={[2, 3, 4]}>
          {user.fullName}
        </Heading>
        <Text fontSize={["md", "lg"]}>@{user.username}</Text>
        <Card variant="outline" className="profile-section">
          <CardBody>
            <Heading as="h5" size="sm" mb={[2, 3, 4]}>
              About Me
            </Heading>
            <Text fontSize={["sm", "md"]}>{user.description}</Text>
            <Text fontSize={["sm", "md"]}>E-mail: {user.email}</Text>
            <Text fontSize={["sm", "md"]}>
              Age:{" "}
              {new Date(
                new Date() - new Date(user.birthDate).getTime(),
              ).getUTCFullYear() - 1970}
            </Text>
            <Text fontSize={["sm", "md"]}>
              From {user.userLocation.selectedLocation}
            </Text>
            <Text fontSize={["sm", "md"]}>Phone: {user.phoneNumber}</Text>
            <Button
              colorScheme="blue"
              mt={[2, 3, 4]}
              onClick={handleToggleModal}
            >
              Edit details
            </Button>
          </CardBody>
        </Card>
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
                value={user.fullName}
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
                    ...provided.container,
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "10px",
                    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                  }),
                  input: (provided) => ({
                    ...provided.input,
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }),
                  option: (provided, state) => ({
                    ...provided.option,
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
            <Button colorScheme="blue" onClick={handleSaveChanges}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={openPhotoModal} onClose={() => setOpenPhotoModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile Photo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={user.profilePhoto} alt="profile-photo" boxSize="100%" />
            <Input
              type="file"
              accept="image/*"
              display="none"
              id="file-input"
              onChange={(e) => setNewProfilePhoto(e.target.files[0])}
            />
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button
              colorScheme="blue"
              onClick={() => document.getElementById("file-input").click()}
            >
              Change Photo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

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
