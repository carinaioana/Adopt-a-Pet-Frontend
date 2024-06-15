import { useEffect, useState } from "react";

import PropTypes from "prop-types";
import axios from "axios";
import Announcement from "../Announcements/Announcement.jsx";
import {
  Avatar,
  Box,
  Button,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, Icon } from "@chakra-ui/icons";
import { useLoading } from "../context/LoadingContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

const ProfileDetails = ({ user, onUserUpdate }) => {
  const { isLoading, setIsLoading } = useLoading();
  const { showSuccess, setShowSuccess } = useNotification();
  const [selectedPet, setSelectedPet] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddPetDialog, setOpenAddPetDialog] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [dogBreeds, setDogBreeds] = useState([]);
  const [catBreeds, setCatBreeds] = useState([]);
  const [newPet, setNewPet] = useState({
    name: "",
    age: "",
    type: "",
    breed: "",
    sex: "",
    description: "",
    traits: [],
    image: "", // Assuming pets have an image property
  });

  const handleOpenAddPetDialog = () => {
    setNewPet({
      name: "",
      age: "",
      type: "",
      breed: "",
      sex: "",
      description: "",
      traits: [],
      image: "",
    });
    setOpenAddPetDialog(true);
  };

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

  useEffect(() => {
    if (selectedPet) {
      const currentPet = user.petProfiles.find(
        (pet) => pet.name === selectedPet.name,
      );
      setSelectedPet(currentPet);
    }
  }, [user.petProfiles]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const token = localStorage.getItem("authToken"); // Replace 'yourTokenKey' with the actual key
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://localhost:7141/api/v1/Announc/my-announcements",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const announcementsWithUser = await Promise.all(
          response.data.announcements.map(async (announcement) => {
            const userResponse = await axios.get(
              `https://localhost:7141/api/v1/Authentication/userinfo/${announcement.createdBy}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            return { ...announcement, userName: userResponse.data.name };
          }),
        );
        setAnnouncements(announcementsWithUser);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    // Fetch current user's details
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("authToken");
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://localhost:7141/api/v1/Authentication/currentuserinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCurrentUser(
          response.data.claims[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
        );
      } catch (error) {
        console.error("Error fetching current user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleAddPet = async () => {
    const authToken = localStorage.getItem("authToken");
    const newPetData = {
      animalType: newPet.type,
      animalName: newPet.name,
      animalDescription: newPet.description,
      personalityTraits: newPet.traits,
      animalAge: newPet.age,
      animalBreed: newPet.breed,
      animalSex: newPet.sex,
      imageUrl: newPet.image,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://localhost:7141/api/v1/Animals",
        newPetData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (response.status === 201) {
        showSuccess("Pet added successfully!");
      }
      setOpenAddPetDialog(false);

      const addedPet = response.data;
      onUserUpdate({ ...user, petProfiles: [...user.petProfiles, addedPet] });
      setSelectedPet(addedPet);
      // window.location.reload();
    } catch (error) {
      console.error("Error adding pet:", error);
      showError("Error adding pet!");
    } finally {
      setIsLoading(false);
    }
  };
  const handleOpenDialog = (pet) => {
    setSelectedPet({ ...pet });
    setOpenDialog(true);
    setIsEditMode(false); // Ensure edit mode is reset/false when opening the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [isEditMode, setIsEditMode] = useState(false);

  const [newTrait, setNewTrait] = useState(""); // State to hold new trait value

  const handleSaveChanges = () => {
    const updatedPetProfiles = user.petProfiles.map((pet) =>
      pet.id === selectedPet.id ? selectedPet : pet,
    );
    onUserUpdate({ ...user, petProfiles: updatedPetProfiles });
    setOpenDialog(false); // Close the dialog after saving changes
  };

  // const [showNewTraitBox, setShowNewTraitBox] = useState(false);
  // const handleAddTrait = () => {
  //   if (!newTrait.trim()) return; // Prevent adding empty traits
  //   const updatedTraits = [...selectedPet.traits, newTrait];
  //   setSelectedPet({ ...selectedPet, traits: updatedTraits });
  //   // Update the user's petProfiles array with the new trait
  //   const updatedPetProfiles = user.petProfiles.map((pet) =>
  //     pet.name === selectedPet.name
  //       ? { ...selectedPet, traits: updatedTraits }
  //       : pet,
  //   );
  //   onUserUpdate({ ...user, petProfiles: updatedPetProfiles });
  //   setNewTrait(""); // Reset new trait input
  // };

  const handleDeleteAnnouncement = async (announcementId) => {
    const token = localStorage.getItem("authToken"); // Adjust if your token is stored differently
    try {
      setIsLoading(true);
      await axios.delete(
        `https://localhost:7141/api/v1/Announc/${announcementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAnnouncements(
        announcements.filter(
          (announcement) => announcement.announcementId !== announcementId,
        ),
      );
    } catch (error) {
      console.error("Error deleting announcement:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `https://localhost:7141/api/v1/Animals/${selectedPet.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (response.status === 204) {
        showSuccess("Pet deleted successfully!");
      }
      setOpenDeleteModal(false);
      setOpenDialog(false);
      const updatedPetProfiles = user.petProfiles.filter(
        (pet) => pet.id !== selectedPet.id,
      );
      onUserUpdate({ ...user, petProfiles: updatedPetProfiles });
    } catch (error) {
      console.error("Error deleting pet:", error);
      showError("Error deleting pet!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container
      maxW="container.xl"
      p={4}
      mt={8}
      borderRadius="md"
      boxShadow="md"
    >
      <Box borderWidth="1px" borderRadius="md" p={4} boxShadow="md" mt={4}>
        <Box mb={4}>
          <Heading as="h2" size="xl">
            Pet Profiles
          </Heading>
        </Box>
        <Stack
          direction={{ base: "column", sm: "row" }}
          spacing={4}
          alignItems="center"
          width="100%"
          flexWrap="wrap" // Added to allow wrapping
          overflowX="auto"
        >
          {user.petProfiles.map((pet, index) => (
            <Tag
              key={index}
              size="lg"
              borderRadius="xl"
              variant="subtle"
              colorScheme="teal"
              cursor="pointer"
              onClick={() => handleOpenDialog(pet)}
              p={2}
              m="1rem"
              _hover={{
                border: "2px solid teal",
                transform: "scale(1.05)",
                transition: "transform 0.2s",
                position: "relative",
                zIndex: 999,
              }}
            >
              <Avatar
                name={pet.name}
                src={pet.image}
                size="sm"
                ml={-1}
                mr={2}
                border="2px solid white"
              />
              <TagLabel fontWeight="bold">{`${pet.name} (${pet.type})`}</TagLabel>
            </Tag>
          ))}
          <IconButton
            colorScheme="teal"
            aria-label="Add new pet"
            icon={<AddIcon />}
            onClick={handleOpenAddPetDialog}
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
          />
        </Stack>

        <Modal isOpen={openDialog} onClose={handleCloseDialog} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedPet ? `${selectedPet.name}'s Details` : ""}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedPet && (
                <SimpleGrid columns={2} spacing={6}>
                  <Box>
                    <Avatar
                      name={selectedPet.name}
                      src={selectedPet.image}
                      size="2xl"
                    />
                  </Box>
                  <Box>
                    {isEditMode ? (
                      <>
                        <FormControl mb={4}>
                          <FormLabel>Name</FormLabel>
                          <Input
                            value={selectedPet.name}
                            onChange={(e) => {
                              const updatedPet = {
                                ...selectedPet,
                                name: e.target.value,
                              };
                              setSelectedPet(updatedPet);
                              const updatedPetProfiles = user.petProfiles.map(
                                (pet) =>
                                  pet.name === selectedPet.name
                                    ? updatedPet
                                    : pet,
                              );
                              onUserUpdate({
                                ...user,
                                petProfiles: updatedPetProfiles,
                              });
                            }}
                          />
                        </FormControl>
                        <FormControl mb={4}>
                          <FormLabel>Age</FormLabel>
                          <Input
                            type="number"
                            value={selectedPet.age.toString()}
                            onChange={(e) => {
                              const updatedPet = {
                                ...selectedPet,
                                age: Number(e.target.value),
                              };
                              setSelectedPet(updatedPet);
                              const updatedPetProfiles = user.petProfiles.map(
                                (pet) =>
                                  pet.name === selectedPet.name
                                    ? updatedPet
                                    : pet,
                              );
                              onUserUpdate({
                                ...user,
                                petProfiles: updatedPetProfiles,
                              });
                            }}
                          />
                        </FormControl>
                        <FormControl mb={4}>
                          <FormLabel>Type</FormLabel>
                          <Select
                            value={selectedPet.type}
                            onChange={(e) => {
                              const updatedPet = {
                                ...selectedPet,
                                type: e.target.value,
                              };
                              setSelectedPet(updatedPet);
                              const updatedPetProfiles = user.petProfiles.map(
                                (pet) =>
                                  pet.name === selectedPet.name
                                    ? updatedPet
                                    : pet,
                              );
                              onUserUpdate({
                                ...user,
                                petProfiles: updatedPetProfiles,
                              });
                            }}
                          >
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                          </Select>
                        </FormControl>
                        <FormControl mb={4}>
                          <FormLabel>Breed</FormLabel>
                          <Select
                            value={selectedPet.breed}
                            onChange={(e) => {
                              const updatedPet = {
                                ...selectedPet,
                                breed: e.target.value,
                              };
                              setSelectedPet(updatedPet);
                              const updatedPetProfiles = user.petProfiles.map(
                                (pet) =>
                                  pet.name === selectedPet.name
                                    ? updatedPet
                                    : pet,
                              );
                              onUserUpdate({
                                ...user,
                                petProfiles: updatedPetProfiles,
                              });
                            }}
                          >
                            {selectedPet.type === "Dog" &&
                              dogBreeds.map((breed) => (
                                <option key={breed.id} value={breed.name}>
                                  {breed.name}
                                </option>
                              ))}
                            {selectedPet.type === "Cat" &&
                              catBreeds.map((breed) => (
                                <option key={breed.id} value={breed.name}>
                                  {breed.name}
                                </option>
                              ))}
                          </Select>
                        </FormControl>
                        <FormControl mb={4}>
                          <FormLabel>Sex</FormLabel>
                          <Select
                            value={selectedPet.sex}
                            onChange={(e) => {
                              const updatedPet = {
                                ...selectedPet,
                                sex: e.target.value,
                              };
                              setSelectedPet(updatedPet);
                              const updatedPetProfiles = user.petProfiles.map(
                                (pet) =>
                                  pet.name === selectedPet.name
                                    ? updatedPet
                                    : pet,
                              );
                              onUserUpdate({
                                ...user,
                                petProfiles: updatedPetProfiles,
                              });
                            }}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </Select>
                        </FormControl>
                        <FormControl mb={4}>
                          <FormLabel>Description</FormLabel>
                          <Input
                            value={selectedPet.description}
                            onChange={(e) => {
                              const updatedPet = {
                                ...selectedPet,
                                description: e.target.value,
                              };
                              setSelectedPet(updatedPet);
                              const updatedPetProfiles = user.petProfiles.map(
                                (pet) =>
                                  pet.name === selectedPet.name
                                    ? updatedPet
                                    : pet,
                              );
                              onUserUpdate({
                                ...user,
                                petProfiles: updatedPetProfiles,
                              });
                            }}
                          />
                        </FormControl>
                        <FormControl mb={4}>
                          <FormLabel>Traits</FormLabel>
                          <Select
                            placeholder="Select traits"
                            onChange={(e) => {
                              const selectedTrait = e.target.value;
                              if (!selectedPet.traits.includes(selectedTrait)) {
                                const updatedPet = {
                                  ...selectedPet,
                                  traits: [
                                    ...selectedPet.traits,
                                    selectedTrait,
                                  ],
                                };
                                setSelectedPet(updatedPet);
                                const updatedPetProfiles = user.petProfiles.map(
                                  (pet) =>
                                    pet.name === selectedPet.name
                                      ? updatedPet
                                      : pet,
                                );
                                onUserUpdate({
                                  ...user,
                                  petProfiles: updatedPetProfiles,
                                });
                              }
                            }}
                          >
                            <option value="playful">Playful</option>
                            <option value="loving">Loving</option>
                            <option value="gourmand">Gourmand</option>
                            <option value="energetic">Energetic</option>
                            <option value="curious">Curious</option>
                          </Select>
                          <Box mt={2}>
                            {selectedPet.traits.map((trait, index) => (
                              <Tag
                                key={index}
                                size="md"
                                borderRadius="full"
                                variant="solid"
                                colorScheme={
                                  [
                                    "teal",
                                    "blue",
                                    "green",
                                    "red",
                                    "purple",
                                    "orange",
                                  ][Math.floor(Math.random() * 6)]
                                }
                                mr={2}
                                mt={2}
                              >
                                <TagLabel>{trait}</TagLabel>
                                <TagCloseButton
                                  onClick={() => {
                                    const updatedPet = {
                                      ...selectedPet,
                                      traits: selectedPet.traits.filter(
                                        (t) => t !== trait,
                                      ),
                                    };
                                    setSelectedPet(updatedPet);
                                    const updatedPetProfiles =
                                      user.petProfiles.map((pet) =>
                                        pet.name === selectedPet.name
                                          ? updatedPet
                                          : pet,
                                      );
                                    onUserUpdate({
                                      ...user,
                                      petProfiles: updatedPetProfiles,
                                    });
                                  }}
                                />
                              </Tag>
                            ))}
                          </Box>
                        </FormControl>
                      </>
                    ) : (
                      <>
                        <Text>Name: {selectedPet.name}</Text>
                        <Text>Age: {selectedPet.age}</Text>
                        <Text>Type: {selectedPet.type}</Text>
                        <Text>Breed: {selectedPet.breed}</Text>
                        <Text>Sex: {selectedPet.sex}</Text>
                        <Text>Description: {selectedPet.description}</Text>
                        <Box mt={2}>
                          <Text>Traits:</Text>
                          {selectedPet.traits &&
                          selectedPet.traits.length > 0 ? (
                            selectedPet.traits.map((trait, index) => (
                              <Tag key={index} mr={2} mt={2}>
                                {trait}
                              </Tag>
                            ))
                          ) : (
                            <Text>No traits added</Text>
                          )}
                        </Box>
                      </>
                    )}
                  </Box>
                </SimpleGrid>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleCloseDialog}>Close</Button>
              {isEditMode ? (
                <Button colorScheme="teal" onClick={handleSaveChanges}>
                  Save
                </Button>
              ) : (
                <Button
                  ml={2}
                  colorScheme="teal"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit
                </Button>
              )}
              <IconButton
                colorScheme="red"
                aria-label="Delete pet"
                icon={<DeleteIcon />}
                onClick={() => handleOpenDeleteModal(selectedPet)}
                ml={2}
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={openAddPetDialog}
          onClose={() => setOpenAddPetDialog(false)}
          size="md"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Pet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  value={newPet.name}
                  onChange={(e) =>
                    setNewPet({ ...newPet, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Age</FormLabel>
                <Input
                  type="number"
                  value={newPet.age}
                  onChange={(e) =>
                    setNewPet({ ...newPet, age: e.target.value })
                  }
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Type</FormLabel>
                <Select
                  value={newPet.type}
                  onChange={(e) =>
                    setNewPet({ ...newPet, type: e.target.value })
                  }
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Breed</FormLabel>
                <Select
                  value={newPet.breed}
                  onChange={(e) =>
                    setNewPet({ ...newPet, breed: e.target.value })
                  }
                >
                  {newPet.type === "Dog" &&
                    dogBreeds.map((breed) => (
                      <option key={breed.id} value={breed.name}>
                        {breed.name}
                      </option>
                    ))}
                  {newPet.type === "Cat" &&
                    catBreeds.map((breed) => (
                      <option key={breed.id} value={breed.name}>
                        {breed.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Sex</FormLabel>
                <Select
                  value={newPet.sex}
                  onChange={(e) =>
                    setNewPet({ ...newPet, sex: e.target.value })
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  value={newPet.description}
                  onChange={(e) =>
                    setNewPet({ ...newPet, description: e.target.value })
                  }
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Traits</FormLabel>
                <Select
                  placeholder="Select traits"
                  onChange={(e) => {
                    const selectedTrait = e.target.value;
                    if (!newPet.traits.includes(selectedTrait)) {
                      setNewPet({
                        ...newPet,
                        traits: [...newPet.traits, selectedTrait],
                      });
                    }
                  }}
                >
                  <option value="playful">Playful</option>
                  <option value="loving">Loving</option>
                  <option value="gourmand">Gourmand</option>
                  <option value="energetic">Energetic</option>
                  <option value="curious">Curious</option>
                </Select>
                <Box mt={2}>
                  {newPet.traits.map((trait, index) => (
                    <Tag
                      key={index}
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme={
                        ["teal", "blue", "green", "red", "purple", "orange"][
                          Math.floor(Math.random() * 6)
                        ]
                      }
                      mr={2}
                      mt={2}
                    >
                      <TagLabel>{trait}</TagLabel>
                      <TagCloseButton
                        onClick={() => {
                          setNewPet({
                            ...newPet,
                            traits: newPet.traits.filter((t) => t !== trait),
                          });
                        }}
                      />
                    </Tag>
                  ))}
                </Box>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={handleAddPet}>
                Add Pet
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Are you sure you want to delete this pet?</Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpenDeleteModal(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      <Box borderWidth="1px" borderRadius="md" p={4} boxShadow="md">
        <Box mb={4}>
          <Heading as="h2" size="xl">
            My Announcements
          </Heading>
        </Box>
        <Box overflowY="auto">
          {Array.isArray(announcements) ? (
            announcements.map((announcement, index) => (
              <Announcement
                key={index}
                title={announcement.announcementTitle}
                content={announcement.announcementDescription}
                date={new Date(announcement.announcementDate).toLocaleString(
                  "en-UK",
                )}
                username={announcement.userName}
                currentUserId={currentUser}
                imageUrl={announcement.imageUrl}
                announcementUserId={announcement.createdBy}
                announcementId={announcement.announcementId}
                onDelete={() =>
                  handleDeleteAnnouncement(announcement.announcementId)
                }
              />
            ))
          ) : (
            <Text>No announcements found.</Text>
          )}
        </Box>
      </Box>
    </Container>
  );
};

ProfileDetails.propTypes = {
  user: PropTypes.shape({
    description: PropTypes.string,
    email: PropTypes.string,
    age: PropTypes.number,
    announcements: PropTypes.array,
    petProfiles: PropTypes.array,
    reviews: PropTypes.array,
  }).isRequired,
  onUserUpdate: PropTypes.func.isRequired,
};
export default ProfileDetails;
