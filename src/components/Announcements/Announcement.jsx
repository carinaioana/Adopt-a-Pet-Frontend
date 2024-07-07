import { useEffect, useState } from "react";
import {
  FaCat,
  FaCheckCircle,
  FaClock,
  FaDog,
  FaEdit,
  FaEllipsisV,
  FaHeart,
  FaMapMarkerAlt,
  FaMars,
  FaPaw,
  FaSave,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUpload,
  FaVenus,
  FaVenusMars,
} from "react-icons/fa";
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
  Container,
  Tag,
  FormControl,
  FormLabel,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  Flex,
  Spacer,
  Divider,
  HStack,
  TagLeftIcon,
  TagLabel,
  WrapItem,
  Wrap,
} from "@chakra-ui/react";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";

const MotionBox = motion(Box);

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
  isHomePage,
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
  const navigate = useNavigate();

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

    const locationToSave = editedLocation || location;
    formData.append("Location", locationToSave);

    if (editedImage) {
      formData.append("ImageFile", editedImage);
    }

    // Update state using callback functions
    setEditedTitle((prevTitle) => {
      formData.set("AnnouncementTitle", prevTitle);
      return prevTitle;
    });
    setEditedContent((prevContent) => {
      formData.set("AnnouncementDescription", prevContent);
      return prevContent;
    });
    setEditedAnimalType((prevType) => {
      formData.set("AnimalType", prevType);
      return prevType;
    });
    setEditedAnimalBreed((prevBreed) => {
      formData.set("AnimalBreed", prevBreed);
      return prevBreed;
    });
    setEditedAnimalGender((prevGender) => {
      formData.set("AnimalGender", prevGender);
      return prevGender;
    });
    setEditedLocation((prevLocation) => {
      formData.set("Location", prevLocation || locationToSave);
      return prevLocation || locationToSave;
    });

    setIsEditModalOpen(false);
    onEdit(announcementId, formData);
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

  let formattedDate;
  try {
    // Parse the date string to a Date object
    const parsedDate = new Date(date);
    // Check if the parsed date is valid
    if (isNaN(parsedDate)) {
      throw new Error("Invalid date");
    }
    // Format the valid date
    formattedDate = format(parsedDate, "PPP");
  } catch (error) {
    console.error(error.message);
    formattedDate = "Invalid date";
  }

  const isOwner = currentUserId === announcementUserId;

  const breedOptions =
    editedAnimalType === "Dog"
      ? dogBreeds
      : editedAnimalType === "Cat"
        ? catBreeds
        : [];

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      h="100%"
    >
      <Container
        maxW={{ base: "100%", sm: "540px", md: "720px" }}
        w="100%"
        boxShadow="lg"
        borderRadius="xl"
        overflow="hidden"
        borderWidth="1px"
        h="100%"
        display="flex"
        flexDirection="column"
      >
        <VStack spacing={3} align="stretch" h="100%">
          <Flex p={4} alignItems="center">
            <Avatar src={userImage} size="md" />
            <Box ml={3}>
              <Text fontWeight="bold" fontSize="lg">
                {username}
              </Text>
              <Text fontSize="sm" color="gray.500">
                <FaClock style={{ display: "inline", marginRight: "5px" }} />
                {formattedDate}
              </Text>
              {location && (
                <Box px={4} pt={2}>
                  <Text fontSize="sm" color="gray.500">
                    <FaMapMarkerAlt
                      style={{ display: "inline", marginRight: "5px" }}
                    />
                    {location}
                  </Text>
                </Box>
              )}
            </Box>
            <Spacer />
            {isOwner && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaEllipsisV />}
                  variant="ghost"
                  aria-label="Options"
                  size="sm"
                />
                <MenuList>
                  <MenuItem icon={<FaEdit />} onClick={handleEditModalOpen}>
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<FaTrash />}
                    onClick={handleDeleteModalOpen}
                    color="red.500"
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>

          <Divider />

          <Box p={4}>
            <Wrap spacing={2} justify="center">
              <WrapItem>
                <Tag
                  size={{ base: "md", md: "lg" }}
                  variant="solid"
                  colorScheme={
                    editedTitle === "Lost"
                      ? "red"
                      : editedTitle === "Found"
                        ? "green"
                        : "blue"
                  }
                >
                  <TagLeftIcon
                    as={
                      editedTitle === "Lost"
                        ? FaSearch
                        : editedTitle === "Found"
                          ? FaCheckCircle
                          : FaHeart
                    }
                  />
                  <TagLabel>{editedTitle}</TagLabel>
                </Tag>
              </WrapItem>
              {animalType && (
                <WrapItem>
                  <Tag
                    size={{ base: "md", md: "lg" }}
                    variant="subtle"
                    colorScheme="purple"
                  >
                    <TagLeftIcon as={FaPaw} />
                    <TagLabel>{animalType}</TagLabel>
                  </Tag>
                </WrapItem>
              )}
              {animalBreed && (
                <WrapItem>
                  <Tag
                    size={{ base: "md", md: "lg" }}
                    variant="subtle"
                    colorScheme="orange"
                  >
                    <TagLeftIcon
                      as={
                        animalType === "Dog"
                          ? FaDog
                          : animalType === "Cat"
                            ? FaCat
                            : FaPaw
                      }
                    />
                    <TagLabel>{animalBreed}</TagLabel>
                  </Tag>
                </WrapItem>
              )}
              {animalGender && (
                <WrapItem>
                  <Tag
                    size={{ base: "md", md: "lg" }}
                    variant="subtle"
                    colorScheme={animalGender === "Male" ? "blue" : "pink"}
                  >
                    <TagLeftIcon
                      as={animalGender === "Male" ? FaMars : FaVenus}
                    />
                    <TagLabel>{animalGender}</TagLabel>
                  </Tag>
                </WrapItem>
              )}
            </Wrap>
          </Box>

          {imageUrl && (
            <Box
              position="relative"
              overflow="hidden"
              borderRadius="md"
              onClick={handleImageModalOpen}
              cursor="pointer"
            >
              <Image
                src={imageUrl}
                alt="Announcement"
                objectFit="cover"
                w="100%"
                h="300px"
              />
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.300"
                opacity="0"
                transition="opacity 0.2s"
                _hover={{ opacity: 1 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontWeight="bold">
                  Click to enlarge
                </Text>
              </Box>
            </Box>
          )}

          {!isHomePage && (
            <Box p={4}>
              <Button
                colorScheme="blue"
                onClick={() => navigate(`/announcement/${announcementId}`)}
                width="full"
              >
                View Details
              </Button>
            </Box>
          )}
        </VStack>
      </Container>

      {/* Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={handleImageModalClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalBody>
            <Image
              src={imageUrl}
              alt="Announcement"
              w="100%"
              maxH="70vh"
              objectFit="contain"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleImageModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
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

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleEditModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Announcement</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Announcement Type</FormLabel>
                <Select
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                >
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                  <option value="For Adoption">For Adoption</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  value={editedAnimalType}
                  onChange={(e) => setEditedAnimalType(e.target.value)}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Breed</FormLabel>
                <Select
                  value={editedAnimalBreed}
                  onChange={(e) => setEditedAnimalBreed(e.target.value)}
                >
                  {breedOptions.map((breed) => (
                    <option key={breed.id} value={breed.name}>
                      {breed.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  value={editedAnimalGender}
                  onChange={(e) => setEditedAnimalGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                  selectProps={{
                    value: editedLocation,
                    onChange: handleLocationChange,
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        "&:hover": {
                          borderColor: "blue.500",
                        },
                      }),
                    },
                  }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Age</FormLabel>
                <Input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g., 2 years"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Color</FormLabel>
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g., Brown and White"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Date Lost/Found</FormLabel>
                <Input
                  type="date"
                  value={dateLostFound}
                  onChange={(e) => setDateLostFound(e.target.value)}
                />
              </FormControl>
              <Button
                as="label"
                leftIcon={<FaUpload />}
                colorScheme="blue"
                variant="outline"
                cursor="pointer"
              >
                Upload Image
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleEditModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
};

export default Announcement;
