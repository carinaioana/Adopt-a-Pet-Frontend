import React, { useEffect, useState } from "react";

import axios from "axios";
import EditModal from "./EditModal";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { useLoading } from "./context/LoadingContext.jsx";
import "../styles/PetProfile.css";
import { ChatIcon } from "@chakra-ui/icons";
import { Spinner, useDisclosure } from "@chakra-ui/react";
import Chatbot from "./ChatBot.jsx";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  VStack,
  Tooltip,
  Button,
  HStack,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Modal,
  FormControl,
  FormLabel,
  Input,
  Text,
  Select,
  Container,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, InfoIcon, AddIcon } from "@chakra-ui/icons";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { useNotification } from "./context/NotificationContext.jsx";
const PetDetailsPage = () => {
  const { petId } = useParams();
  const location = useLocation();
  const { isLoading, setIsLoading } = useLoading();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userDetails } = useAuth();
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const { showSuccess, showError } = useNotification();
  const [selectedPet, setSelectedPet] = useState(
    location.state.selectedPet || null,
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState({
    type: "",
    id: null,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editContext, setEditContext] = useState({
    type: "",
    index: -1,
    value: {},
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [isDewormingModalOpen, setIsDewormingModalOpen] = useState(false);
  const vaccineOptions = {
    dog: [
      { value: "Rabies", label: "Rabies" },
      { value: "DHPP", label: "DHPP" },
      { value: "Leptospirosis", label: "Leptospirosis" },
      { value: "Bordetella", label: "Bordetella" },
      { value: "Lyme", label: "Lyme" },
    ],
    cat: [
      { value: "Rabies", label: "Rabies" },
      { value: "FVRCP", label: "FVRCP" },
      { value: "FeLV", label: "FeLV" },
      { value: "FIP", label: "FIP" },
    ],
  };
  const [observationData, setObservationData] = useState({
    text: "",
    date: new Date(),
  });
  const [newVaccineData, setNewVaccineData] = useState({
    name: "",
    date: new Date(),
  });
  const [newDewormingData, setNewDewormingData] = useState({
    type: "",
    date: new Date(),
  });

  const handleAddNew = (type) => {
    if (type === "observations") {
      setIsModalOpen(true);
    } else if (type === "vaccine") {
      setIsVaccineModalOpen(true);
    } else if (type === "deworming") {
      setIsDewormingModalOpen(true);
    }
  };

  const handleEdit = (type, index, value) => {
    setEditContext({ type, index, value });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (newValue) => {
    const authToken = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      let apiUrl = "";
      let requestBody = {};
      setIsLoading(true);
      if (editContext.type === "vaccine") {
        apiUrl = `https://localhost:7141/api/v1/Vaccination/${newValue.vaccinationId}`;
        requestBody = {
          vaccinationId: newValue.vaccinationId,
          date: newValue.date,
          vaccineName: newValue.name,
          animalId: petId,
        };
      } else if (editContext.type === "deworming") {
        apiUrl = `https://localhost:7141/api/v1/Deworming/${newValue.dewormingId}`;
        requestBody = {
          dewormingId: newValue.dewormingId,
          date: newValue.date,
          dewormingType: newValue.name,
          animalId: selectedPet.animalId,
        };
      } else {
        apiUrl = `https://localhost:7141/api/v1/Observation/${newValue.observationId}`;
        requestBody = {
          observationId: newValue.observationId,
          date: newValue.date,
          observationDescription: newValue.description, // Ensure this matches the expected field name
          animalId: selectedPet.animalId,
        };
      }

      await axios.put(apiUrl, requestBody, { headers });
      showSuccess(`${editContext.type} updated successfully`);
      setEditModalOpen(false);
      fetchPetDetails();
    } catch (error) {
      console.error(`Error updating ${editContext.type}:`, error);
      showError(`Error updating ${editContext.type}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (type, id) => {
    const authToken = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      setIsLoading(true);
      let apiUrl = "";

      if (type === "vaccine") {
        apiUrl = `https://localhost:7141/api/v1/Vaccination/${id.vaccinationId}`;
      } else if (type === "deworming") {
        apiUrl = `https://localhost:7141/api/v1/Deworming/${id.dewormingId}`;
      } else if (type === "observation") {
        apiUrl = `https://localhost:7141/api/v1/Observation/${id.observationId}`;
      }

      const response = await axios.delete(apiUrl, { headers });
      if (response.status === 204) {
        showSuccess(
          `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
        );
      }
      fetchPetDetails();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showError(`Error deleting ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDeleteModal = (type, id) => {
    setDeleteContext({ type, id });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(deleteContext.type, deleteContext.id);
    setDeleteModalOpen(false);
  };

  const fetchPetDetails = async () => {
    try {
      setIsLoading(true);
      const authToken = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };
      const petDetailsResponse = await axios.get(
        `https://localhost:7141/api/v1/Animals/${petId}`,
        { headers },
      );

      const petDetails = petDetailsResponse.data;
      setSelectedPet((prevState) => ({
        ...prevState,
        animalName: petDetails.animalName,
        animalType: petDetails.animalType,
        animalAge: petDetails.animalAge,
        animalBreed: petDetails.animalBreed,
        animalSex: petDetails.animalSex,
      }));
      const vaccinationsResponse = await axios.get(
        `https://localhost:7141/api/v1/Vaccination/AllByAnimal/${petId}`,
        { headers },
      );
      const observationsResponse = await axios.get(
        `https://localhost:7141/api/v1/Observation/AllByAnimal/${petId}`,
        { headers },
      );
      const dewormingResponse = await axios.get(
        `https://localhost:7141/api/v1/Deworming/AllByAnimal/${petId}`,
        { headers },
      );

      const vaccines = vaccinationsResponse.data.vaccinations
        ? vaccinationsResponse.data.vaccinations.map((vaccine) => ({
            vaccinationId: vaccine.vaccinationId,
            name: vaccine.vaccineName,
            date: vaccine.date,
          }))
        : [];

      const observations = observationsResponse.data.observations
        ? observationsResponse.data.observations.map((observation) => ({
            observationId: observation.observationId,
            description: observation.observationDescription,
            date: observation.date,
          }))
        : [];

      const deworming = dewormingResponse.data.dewormings
        ? dewormingResponse.data.dewormings.map((deworm) => ({
            dewormingId: deworm.dewormingId,
            type: deworm.dewormingType,
            date: deworm.date,
          }))
        : [];

      setSelectedPet((prevState) => ({
        ...prevState,
        vaccines: [...vaccines],
        deworming: [...deworming],
        observations: [...observations],
      }));
    } catch (error) {
      console.error("Failed to fetch pet details:", error);
      showError("Failed to fetch pet details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPet) {
      fetchPetDetails();
    }
  }, [location, petId]);

  const handleOpenChatbot = async () => {
    await fetchPetDetails();
    console.log(selectedPet);
    onOpen();
  };
  const handleSubmitObservation = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      setIsLoading(true);
      await axios.post(
        "https://localhost:7141/api/v1/Observation",
        {
          date: observationData.date,
          observationDescription: observationData.text,
          animalId: selectedPet.animalId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (response.data.success === true) {
        showSuccess("Observation added successfully");
      }

      fetchPetDetails();
      setIsModalOpen(false);
    } catch (error) {
      showError("Error submitting observation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitVaccine = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://localhost:7141/api/v1/Vaccination",
        {
          date: newVaccineData.date,
          vaccineName: newVaccineData.name,
          animalId: selectedPet.animalId, // Ensure the animalId is included in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (response.data.success === true) {
        showSuccess("Vaccine added successfully");
      }

      setIsVaccineModalOpen(false);
      fetchPetDetails();
    } catch (error) {
      showError("Error submitting vaccine");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmitDeworming = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://localhost:7141/api/v1/Deworming",
        {
          date: newDewormingData.date,
          dewormingType: newDewormingData.type,
          animalId: selectedPet.animalId, // Ensure the animalId is included in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (response.status === 200) {
        showSuccess("Deworming added successfully");
      }

      setIsDewormingModalOpen(false);
      fetchPetDetails();
    } catch (error) {
      showError("Error submitting deworming");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}{" "}
      <Container
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        centerContent
        minWidth="80vw"
        overflow="hidden"
        p={{ base: "1rem", md: "2rem" }}
        mt={{ base: "0.5rem", md: "1rem" }}
        borderRadius="12px"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
        position="relative"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          position="relative"
          className="pet-details-container"
          width={{ base: "100%", md: "40%" }}
          mb={{ base: "1rem", md: "0" }}
          minHeight={{ base: "auto", md: "100%" }}
        >
          <Box className="pet-details-header">
            <Avatar
              src={selectedPet.profilePhoto || "default-avatar.png"}
              name={selectedPet.animalName || "Unknown"}
              size="xl"
              mb="2"
            />
            <Text className="pet-info" fontSize="xl" fontWeight="bold" mb="4">
              {selectedPet.animalName
                ? `${selectedPet.animalName}'s Medical Card`
                : "Medical Card"}
            </Text>
            <Box width="100%" mt="2">
              <Text fontSize="lg" fontWeight="semibold" mb="2">
                Owner Details:
              </Text>
              <List spacing={2}>
                <ListItem>
                  <Text fontWeight="bold">Owner:</Text>{" "}
                  {userDetails.name || "Unknown"}
                </ListItem>
              </List>
              <Divider my="4" />
              <Text fontSize="lg" fontWeight="semibold" mb="2">
                Animal Details:
              </Text>
              <List spacing={2}>
                <ListItem>
                  <Text fontWeight="bold">Species:</Text>{" "}
                  {selectedPet.animalType || "Unknown"}
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">Breed:</Text>{" "}
                  {selectedPet.animalBreed || "Unknown"}
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">Gender:</Text>{" "}
                  {selectedPet.animalSex
                    ? selectedPet.animalSex.charAt(0).toUpperCase() +
                      selectedPet.animalSex.slice(1)
                    : "Unknown"}
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">Age:</Text>{" "}
                  {selectedPet.animalAge
                    ? `${selectedPet.animalAge} years`
                    : "Unknown"}
                </ListItem>
              </List>
            </Box>
          </Box>
        </Box>
        <Divider
          orientation="vertical"
          display={{ base: "none", md: "block" }}
        />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          position="relative"
          justifyContent="center"
          width={{ base: "100%", md: "60%" }}
        >
          <VStack align="center" spacing={4}>
            {/* Vaccines Section */}
            <HStack align="center" spacing={2}>
              <Text fontSize="lg" fontWeight="semibold">
                Vaccines
              </Text>
              <Tooltip
                label="Vaccines are a critical piece of information that tells us what diseases we're protecting our pet against."
                hasArrow
                placement="bottom"
              >
                <IconButton
                  icon={<InfoIcon />}
                  size="sm"
                  variant="ghost"
                  aria-label={"Vaccine tooltip"}
                />
              </Tooltip>
            </HStack>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => handleAddNew("vaccine")}
              alignSelf="center"
            >
              Add Vaccine
            </Button>
            {selectedPet.vaccines && selectedPet.vaccines.length > 0 ? (
              selectedPet.vaccines.map((vaccine, index) => (
                <HStack key={index} spacing={4} w="100%">
                  <Text pl={2} flexGrow={1}>
                    • {vaccine.name}, Date:{" "}
                    {new Date(vaccine.date).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </Text>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    onClick={() =>
                      handleEdit("vaccine", index, selectedPet.vaccines[index])
                    }
                    aria-label={"Edit Vaccine"}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    onClick={() =>
                      handleOpenDeleteModal(
                        "vaccine",
                        selectedPet.vaccines[index],
                      )
                    }
                    aria-label={"Delete Vaccine"}
                  />
                </HStack>
              ))
            ) : (
              <Text>N/A</Text>
            )}
          </VStack>
          <Divider my="4" />
          {/* Dewormings Section */}
          <VStack align="center" spacing={4}>
            <HStack spacing={2} alignItems="center">
              <Text fontSize="lg" fontWeight="semibold">
                Dewormings
              </Text>
              <Tooltip
                label="Dewormings are a reminder of the ongoing battle against parasites, ensuring the pet remains healthy and happy."
                hasArrow
                placement="bottom"
              >
                <Box ml={2}>
                  <InfoIcon boxSize={4} />
                </Box>
              </Tooltip>
            </HStack>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => handleAddNew("deworming")}
            >
              Add Deworming
            </Button>
            {selectedPet.deworming && selectedPet.deworming.length > 0 ? (
              selectedPet.deworming.map((deworming, index) => (
                <HStack key={index} spacing={4} w="100%">
                  <Text pl={2} flexGrow={1}>
                    • {deworming.type}, Date:{" "}
                    {new Date(deworming.date).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </Text>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    onClick={() =>
                      handleEdit(
                        "deworming",
                        index,
                        selectedPet.deworming[index],
                      )
                    }
                    aria-label="Edit deworming"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    onClick={() =>
                      handleOpenDeleteModal(
                        "deworming",
                        selectedPet.deworming[index],
                      )
                    }
                    aria-label="Delete deworming"
                  />
                </HStack>
              ))
            ) : (
              <Text>N/A</Text>
            )}
          </VStack>

          {/* Observations Section */}
          <Divider my="4" />
          <VStack align="center" spacing={4}>
            <HStack spacing={2} alignItems="center">
              <Text fontSize="lg" fontWeight="semibold">
                Observations
              </Text>
              <Tooltip
                label="Observations are a more personal space, where anything out of the ordinary is noted for future reference. Whether it's a change in appetite, a new playful habit, or a concern that needs veterinary attention, this diary holds the nuanced details of the pet's life."
                hasArrow
                placement="bottom"
              >
                <Box ml={2}>
                  <InfoIcon boxSize={4} />
                </Box>
              </Tooltip>
            </HStack>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => handleAddNew("observations")}
            >
              Add Observation
            </Button>
            {selectedPet.observations && selectedPet.observations.length > 0 ? (
              selectedPet.observations.map((observation, index) => (
                <HStack key={index} spacing={4} w="100%">
                  <Text pl={2} flexGrow={1}>
                    • {observation.description}, Date:{" "}
                    {new Date(observation.date).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    onClick={() =>
                      handleEdit(
                        "observations",
                        index,
                        selectedPet.observations[index],
                      )
                    }
                    aria-label="Edit observation"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    onClick={() =>
                      handleOpenDeleteModal(
                        "observation",
                        selectedPet.observations[index],
                      )
                    }
                    aria-label="Delete observation"
                  />
                </HStack>
              ))
            ) : (
              <Text>N/A</Text>
            )}
          </VStack>
        </Box>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Observation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor="observation-text">
                  Observation Text
                </FormLabel>
                <Input
                  id="observation-text"
                  type="text"
                  value={observationData.text}
                  onChange={(e) =>
                    setObservationData({
                      ...observationData,
                      text: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor="observation-date">Date</FormLabel>
                <Input
                  id="observation-date"
                  type="date"
                  value={observationData.date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setObservationData({
                      ...observationData,
                      date: new Date(e.target.value),
                    })
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="ghost" onClick={handleSubmitObservation}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <EditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          context={editContext}
        />
        <Modal
          isOpen={isVaccineModalOpen}
          onClose={() => setIsVaccineModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Vaccine</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor="vaccine-name">Vaccine Name</FormLabel>
                <Select
                  placeholder="Select Vaccine"
                  value={newVaccineData.name}
                  onChange={(e) =>
                    setNewVaccineData({
                      ...newVaccineData,
                      name: e.target.value,
                    })
                  }
                >
                  {selectedPet.animalType === "dog"
                    ? vaccineOptions.dog.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))
                    : vaccineOptions.cat.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor="vaccine-date">Date</FormLabel>
                <Input
                  id="vaccine-date"
                  type="date"
                  value={newVaccineData.date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNewVaccineData({
                      ...newVaccineData,
                      date: new Date(e.target.value),
                    })
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => setIsVaccineModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="ghost" onClick={handleSubmitVaccine}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isDewormingModalOpen}
          onClose={() => setIsDewormingModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Deworming</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor="deworming-type">Deworming Type</FormLabel>
                <Select
                  id="deworming-type"
                  value={newDewormingData.type}
                  onChange={(e) =>
                    setNewDewormingData({
                      ...newDewormingData,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Full-spectrum">Full Spectrum</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor="deworming-date">Date</FormLabel>
                <Input
                  id="deworming-date"
                  type="date"
                  value={newDewormingData.date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNewDewormingData({
                      ...newDewormingData,
                      date: new Date(e.target.value),
                    })
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => setIsDewormingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="ghost" onClick={handleSubmitDeworming}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Box position="fixed" bottom="4" right="4" zIndex="tooltip">
          <IconButton
            icon={<ChatIcon />}
            isRound="true"
            size="lg"
            colorScheme="teal"
            onClick={handleOpenChatbot}
            boxShadow="dark-lg"
            aria-label={"chat-button"}
          />
          <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Chat with your Vet Assistant</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {selectedPet ? (
                  <Chatbot selectedPet={selectedPet} />
                ) : (
                  <Spinner />
                )}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
          <Modal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Delete</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Are you sure you want to delete this {deleteContext.type}?
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Container>
    </>
  );
};

export default PetDetailsPage;
