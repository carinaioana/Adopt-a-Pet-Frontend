import React, { useEffect, useState } from "react";

import axios from "axios";
import EditModal from "./EditModal";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import "../styles/PetProfile.css";
import {
  ChatBubble,
  DeleteOutlined,
  EditOutlined,
  InfoOutlined,
  NoteAddOutlined,
} from "@mui/icons-material";
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
const PetDetailsPage = () => {
  const { petId } = useParams();
  const location = useLocation();
  const { userDetails } = useAuth();
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(
    location.state.selectedPet || null,
  );
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
        console.log(apiUrl);
      }

      await axios.put(apiUrl, requestBody, { headers });
      console.log(`${editContext.type} updated successfully`);
      setEditModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(`Error updating ${editContext.type}:`, error);
    }
  };
  const handleDelete = async (type, id) => {
    const authToken = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      let apiUrl = "";

      if (type === "vaccine") {
        apiUrl = `https://localhost:7141/api/v1/Vaccination/${id.vaccinationId}`;
      } else if (type === "deworming") {
        apiUrl = `https://localhost:7141/api/v1/Deworming/${id.dewormingId}`;
      } else if (type === "observation") {
        apiUrl = `https://localhost:7141/api/v1/Observation/${id.observationId}`;
      }

      await axios.delete(apiUrl, { headers });
      console.log(`${type} deleted successfully`);
      window.location.reload();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState({
    type: "",
    id: null,
  });

  const handleOpenDeleteModal = (type, id) => {
    setDeleteContext({ type, id });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(deleteContext.type, deleteContext.id);
    setDeleteModalOpen(false);
  };

  const [forceUpdate, setForceUpdate] = useState(false); // Add this state to your component

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const headers = {
          Authorization: `Bearer ${authToken}`,
        };
        const petDetailsResponse = await axios.get(
          `https://localhost:7141/api/v1/Animals/${petId}`,
          { headers },
        );

        const petDetails = petDetailsResponse.data;
        console.log(petDetails);
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
        console.log(
          vaccinationsResponse.data.vaccinations,
          observationsResponse.data.observations,
          dewormingResponse.data.dewormings,
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

        console.log(deworming);

        setSelectedPet((prevState) => ({
          ...prevState,
          vaccines: [...vaccines],
          deworming: [...deworming],
          observations: [...observations],
        }));

        // Toggle the forceUpdate state to force a re-render
        setForceUpdate((prev) => !prev);
      } catch (error) {
        console.error("Failed to fetch pet details:", error);
        // Handle errors appropriately
      }
    };

    if (selectedPet) {
      fetchPetDetails();
    }
  }, [location, petId]);
  const handleSubmitObservation = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.post(
        "https://localhost:7141/api/v1/Observation",
        {
          date: observationData.date,
          observationDescription: observationData.text,
          animalId: selectedPet.animalId, // Ensure the animalId is included in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      console.log("Observation added successfully");
      setIsModalOpen(false); // Close the modal after successful submission
      // Optionally, refresh observations list here
    } catch (error) {
      console.error("Error submitting observation:", error);
    }
  };

  const handleSubmitVaccine = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.post(
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
      console.log("Vaccine added successfully");
      setIsVaccineModalOpen(false); // Close the modal after successful submission
      // Optionally, refresh vaccines list here
    } catch (error) {
      console.error("Error submitting vaccine:", error);
    }
  };
  const handleSubmitDeworming = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.post(
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
      console.log("Deworming added successfully");
      setIsDewormingModalOpen(false); // Close the modal after successful submission
      // Optionally, refresh deworming list here
    } catch (error) {
      console.error("Error submitting deworming:", error);
    }
  };

  return (
    <Container
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      centerContent
      minWidth="80vw"
      overflow="hidden"
      p="2rem"
      mt="1rem"
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
        mb={{ base: "2rem", md: "0" }}
      >
        <Box className="pet-details-header">
          <Avatar
            src={selectedPet.profilePhoto}
            name={selectedPet.animalName}
            size="xl"
            mb="2"
          />
          <Text className="pet-info" fontSize="xl" fontWeight="bold" mb="4">
            {selectedPet.animalName}&apos;s Medical Card
          </Text>
          <Box width="100%" mt="2">
            <Text fontSize="lg" fontWeight="semibold" mb="2">
              Owner Details:
            </Text>
            <List spacing={2}>
              <ListItem>
                <Text fontWeight="bold">Owner:</Text> {userDetails.name}
              </ListItem>
            </List>
            <Divider my="4" />
            <Text fontSize="lg" fontWeight="semibold" mb="2">
              Animal Details:
            </Text>
            <List spacing={2}>
              <ListItem>
                <Text fontWeight="bold">Species:</Text> {selectedPet.animalType}
              </ListItem>
              <ListItem>
                <Text fontWeight="bold">Breed:</Text> {selectedPet.animalBreed}
              </ListItem>
              <ListItem>
                <Text fontWeight="bold">Sex:</Text>{" "}
                {selectedPet.animalSex.charAt(0).toUpperCase() +
                  selectedPet.animalSex.slice(1)}
              </ListItem>
              <ListItem>
                <Text fontWeight="bold">Age:</Text>{" "}
                {`${selectedPet.animalAge} years`}
              </ListItem>
            </List>
          </Box>
        </Box>
      </Box>
      <Divider orientation="vertical" display={{ base: "none", md: "block" }} />
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
                    handleEdit("deworming", index, selectedPet.deworming[index])
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
              <FormLabel htmlFor="observation-text">Observation Text</FormLabel>
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
                isSearchable
                options={
                  selectedPet.animalType === "dog"
                    ? vaccineOptions.dog.map((option) => ({
                        label: option,
                        value: option,
                      }))
                    : vaccineOptions.cat.map((option) => ({
                        label: option,
                        value: option,
                      }))
                }
                value={newVaccineData.name}
                onChange={(option) =>
                  setNewVaccineData({
                    ...newVaccineData,
                    name: option.value,
                  })
                }
              />
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
              <Input
                id="deworming-type"
                type="text"
                value={newDewormingData.type}
                onChange={(e) =>
                  setNewDewormingData({
                    ...newDewormingData,
                    type: e.target.value,
                  })
                }
              />
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
    </Container>
  );
};

export default PetDetailsPage;
