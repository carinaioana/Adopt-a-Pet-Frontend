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

const ProfileHeader = ({ user, onUserUpdate }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    user.userLocation.selectedLocation,
  );
  const [openModal, setOpenModal] = useState(false);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);

  const handleLocationChange = (value) => {
    geocodeByPlaceId(value.value.place_id)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        onUserUpdate({
          ...user,
          userLocation: { selectedLocation: value.label, lat, lng },
        });
      });
    setSelectedLocation(value);
  };
  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };
  return (
    <Container
      maxW="container.xl"
      p={4}
      mt={8}
      borderRadius="md"
      boxShadow="md"
    >
      <Card variant="outline">
        <CardBody position="relative" display="flex" justifyContent="center">
          <Image
            src={user.profilePhoto}
            alt="profile-photo"
            boxSize="250px"
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
        <Heading as="h4" size="md" mb={4}>
          {user.fullName}
        </Heading>
        <Text fontSize="lg">@{user.username}</Text>
        <Card variant="outline" className="profile-section">
          <CardBody>
            <Heading as="h5" size="sm" mb={4}>
              About Me
            </Heading>
            <Text>{user.description}</Text>
            <Text>E-mail: {user.email}</Text>
            <Text>Age: {user.age.toString()}</Text>
            <Text>From {user.userLocation.selectedLocation}</Text>
            <Button colorScheme="blue" mt={4} onClick={handleToggleModal}>
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
              <FormLabel>Age</FormLabel>
              <Input
                id="age"
                type="number"
                value={user.age.toString()}
                onChange={(e) =>
                  onUserUpdate({ ...user, age: parseInt(e.target.value, 10) })
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
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleToggleModal}>Cancel</Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleToggleModal();
                console.log("Save changes");
              }}
            >
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
              onChange={(e) => console.log(e.target.files[0])}
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
