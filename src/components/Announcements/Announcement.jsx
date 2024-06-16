import { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes, FaTrash, FaUpload } from "react-icons/fa";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  useColorModeValue,
  Container,
  Textarea,
  Tag,
  FormControl,
  FormLabel,
  Select,
  Heading,
  Progress,
} from "@chakra-ui/react";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import axios from "axios";

const Announcement = ({
  title,
  content,
  animalType,
  animalBreed,
  animalGender,
  location,
  onEdit,
  onDelete,
  currentUserId,
  announcementUserId,
  announcementId,
  imageUrl,
  username,
  userImage,
  date,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedAnimalType, setEditedAnimalType] = useState("");
  const [editedAnimalBreed, setEditedAnimalBreed] = useState("");
  const [editedAnimalGender, setEditedAnimalGender] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState();
  const [age, setAge] = useState("");
  const [color, setColor] = useState("");
  const [dateLostFound, setDateLostFound] = useState("");
  const [editedLocation, setEditedLocation] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dogBreeds, setDogBreeds] = useState([]);
  const [catBreeds, setCatBreeds] = useState([]);

  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await axios.get("https://api.thedogapi.com/v1/breeds");
        setDogBreeds(response.data);
      } catch (error) {
        console.error("Error fetching dog breeds:", error);
      }
    };

    const fetchCatBreeds = async () => {
      try {
        const response = await axios.get("https://api.thecatapi.com/v1/breeds");
        setCatBreeds(response.data);
      } catch (error) {
        console.error("Error fetching cat breeds:", error);
      }
    };

    fetchDogBreeds();
    fetchCatBreeds();
  }, []);

  const handleEditModalOpen = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleImageChange = (e) => {
    setEditedImage(e.target.files[0]);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("AnnouncementId", announcementId);
    formData.append("AnnouncementTitle", editedTitle);
    formData.append("AnnouncementDate", new Date().toISOString());
    let description = "";
    if (age) description += `Age: ${age}, `;
    if (color) description += `Color: ${color}, `;
    if (dateLostFound) description += `Date Lost/Found: ${dateLostFound}, `;
    if (description) {
      description = description.slice(0, -2);
      formData.append("AnnouncementDescription", description);
    }
    formData.append("AnimalType", editedAnimalType);
    formData.append("AnimalBreed", editedAnimalBreed);
    formData.append("AnimalGender", editedAnimalGender);
    formData.append("Location", editedLocation);

    if (editedImage) {
      formData.append("ImageFile", editedImage);
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    onEdit(announcementId, formData);
    setIsEditModalOpen(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleImageModalOpen = () => {
    setIsImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
  };

  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleLocationChange = (value) => {
    geocodeByPlaceId(value.value.place_id)
      .then((results) => {
        const formattedAddress = results[0].formatted_address;
        setEditedLocation(formattedAddress);
      })
      .catch((error) => {
        console.error("Error fetching location details:", error);
      });
  };

  const isOwner = currentUserId === announcementUserId;

  return (
    <Container
      display="flex"
      flexDirection="column"
      bg={useColorModeValue("white", "gray.700")}
      boxShadow="md"
      borderRadius="md"
      overflow="hidden"
      mb={4}
    >
      <Box
        p={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex="1"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Box display="flex" alignItems="center" gap="2">
              <Avatar src={userImage} />
              <Text fontWeight="bold">{username}</Text>
            </Box>

            {isOwner && (
              <Box display="flex" gap={2}>
                {isEditing ? (
                  <>
                    <IconButton
                      icon={<FaSave />}
                      aria-label="Save"
                      onClick={handleSave}
                    />
                    <IconButton
                      icon={<FaTimes />}
                      aria-label="Cancel"
                      onClick={handleCancel}
                    />
                  </>
                ) : (
                  <>
                    <IconButton
                      icon={<FaEdit />}
                      aria-label="Edit"
                      onClick={handleEditModalOpen}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Delete"
                      onClick={handleDeleteModalOpen}
                    />
                  </>
                )}
              </Box>
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          mt={4}
        >
          <Tag
            size="lg"
            variant="solid"
            colorScheme={
              editedTitle === "Lost"
                ? "red"
                : editedTitle === "Found"
                  ? "teal"
                  : "orange"
            }
            flexShrink={0}
          >
            {editedTitle}
          </Tag>
          <Text fontSize="sm" color="gray.500" textAlign="right">
            Date Created: {date}
          </Text>
        </Box>
      </Box>
      {imageUrl && (
        <Box
          mx="auto"
          maxW="xl"
          minW="xs"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          cursor="pointer"
          onClick={handleImageModalOpen}
          flex="1"
          m="0.5rem"
        >
          <Image
            src={imageUrl}
            alt="Announcement"
            maxH="200px"
            objectFit="cover"
            w="100%"
            onError={(e) => console.error("Image failed to load:", e)}
          />
        </Box>
      )}
      <Box p={4} flex="1" m="0.5rem">
        {animalType && (
          <Text mb={2}>
            <strong>Species:</strong> {animalType}
          </Text>
        )}
        {animalBreed && (
          <Text mb={2}>
            <strong>Breed:</strong> {animalBreed}
          </Text>
        )}
        {animalGender && (
          <Text mb={2}>
            <strong>Gender:</strong> {animalGender}
          </Text>
        )}
        {location && (
          <Text mb={2}>
            <strong>Location:</strong> {location}
          </Text>
        )}
        <Text mt={4}>
          {editedContent.split(", ").map((line, index) => (
            <Box key={index}>{line}</Box>
          ))}
        </Text>
      </Box>
      <Modal isOpen={isImageModalOpen} onClose={handleImageModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalBody>
            <Image
              src={imageUrl}
              alt="Announcement"
              w="100%"
              onError={(e) => console.error("Image failed to load:", e)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleImageModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Announcement</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this announcement?</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleDeleteModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onDelete();
                handleDeleteModalClose();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={handleEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Announcement</ModalHeader>
          <ModalBody>
            <Box
              as="form"
              mt={2}
              overflow="auto"
              maxH="70vh"
              width="100%"
              maxWidth={600}
              display="flex"
              flexDirection="column"
            >
              <FormControl mb={4} isRequired>
                <FormLabel>Announcement Type</FormLabel>
                <Select
                  placeholder="Announcement Type"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                >
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                  <option value="For Adoption">For Adoption</option>
                </Select>
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  placeholder="Type"
                  value={editedAnimalType}
                  onChange={(e) => setEditedAnimalType(e.target.value)}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Breed</FormLabel>
                <Select
                  placeholder="Breed"
                  value={editedAnimalBreed}
                  onChange={(e) => setEditedAnimalBreed(e.target.value)}
                >
                  {animalType === "Dog" &&
                    dogBreeds.map((breed) => (
                      <option key={breed.id} value={breed.name}>
                        {breed.name}
                      </option>
                    ))}
                  {animalType === "Cat" &&
                    catBreeds.map((breed) => (
                      <option key={breed.id} value={breed.name}>
                        {breed.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  placeholder="Gender"
                  value={editedAnimalGender}
                  onChange={(e) => setEditedAnimalGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Location</FormLabel>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                  selectProps={{
                    editedLocation,
                    onChange: handleLocationChange,
                  }}
                  placeholder="Search for a location"
                  fetchDetails={true}
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
              <FormControl mb={4} isRequired>
                <FormLabel>Age</FormLabel>
                <Input
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Color</FormLabel>
                <Input
                  placeholder="Color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Date Lost/Found</FormLabel>
                <Input
                  type="date"
                  value={dateLostFound}
                  onChange={(e) => setDateLostFound(e.target.value)}
                />
              </FormControl>
              <Button as="label" variant="outline" leftIcon={<FaUpload />}>
                Upload Image
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleEditModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Announcement;
