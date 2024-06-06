import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import "../styles/PetProfile.css";
import "../styles/App.css";
import NoteAddIcon from "@mui/icons-material/NoteAdd"; // Add this import at the beginning of your file
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

const PetDetailsPage = () => {
  const { petId } = useParams();
  const location = useLocation();
  const { userDetails } = useAuth();
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

  const handleSaveField = (field, value) => {
    // Update logic for selectedPet based on field and value
    console.log(`Saving ${field} with value ${value}`);
    // Here you would typically update the state or make an API call to save the updated value
    setSelectedPet((prev) => ({ ...prev, [field]: value }));
  };

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

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const headers = {
          Authorization: `Bearer ${authToken}`,
        };
        console.log(selectedPet.animalId);
        const vaccinationsResponse = await axios.get(
          `https://localhost:7141/api/v1/Vaccination/AllByAnimal/${selectedPet.animalId}`,
          { headers },
        );
        const observationsResponse = await axios.get(
          `https://localhost:7141/api/v1/Observation/AllByAnimal/${selectedPet.animalId}`,
          { headers },
        );
        const dewormingResponse = await axios.get(
          `https://localhost:7141/api/v1/Deworming/AllByAnimal/${selectedPet.animalId}`,
          { headers },
        );
        console.log(
          vaccinationsResponse.data.vaccinations,
          observationsResponse.data.observations,
          dewormingResponse.data.dewormings,
        );

        const vaccines = vaccinationsResponse.data.vaccinations.map(
          (vaccine) => ({
            name: vaccine.vaccineName,
            date: vaccine.date,
          }),
        );

        const observations = observationsResponse.data.observations.map(
          (observation) => ({
            description: observation.observationDescription,
            date: observation.date,
          }),
        );

        const deworming = dewormingResponse.data.dewormings.map((deworm) => ({
          type: deworm.dewormingType,
          date: deworm.date,
        }));

        console.log(deworming);

        const petDetails = {
          ...selectedPet, // Spread the existing selectedPet object to keep all its properties
          vaccines,
          deworming,
          observations,
        };
        console.log(petDetails);

        setSelectedPet(petDetails);
      } catch (error) {
        console.error("Failed to fetch pet details:", error);
        // Handle errors appropriately
      }
    };

    if (selectedPet) {
      fetchPetDetails();
    }
  }, []);

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
    <Card sx={{ margin: "2rem", padding: "1.25rem" }}>
      <CardContent
        variant="outlined"
        sx={{
          marginTop: "5rem",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        className="pet-details-container"
      >
        <CardContent className="pet-details-header">
          <Avatar
            className="pet-photo"
            src={selectedPet.profilePhoto}
            alt={selectedPet.animalName}
            sx={{ width: 90, height: 90, mb: 2 }}
          />
          <Typography
            className="pet-info"
            variant="h5"
            component="h2"
            gutterBottom
          >
            {selectedPet.animalName}&apos;s Medical Card
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Owner Details:
            </Typography>
            <List className="pet-info">
              <ListItem>
                <ListItemText primary="Owner" secondary={userDetails.name} />
              </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Animal Details:
            </Typography>
            <List className="pet-info">
              <ListItem>
                <ListItemText
                  primary="Species"
                  secondary={selectedPet.animalType}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Age"
                  secondary={`${selectedPet.animalAge} years`}
                />
              </ListItem>
            </List>
          </Box>
        </CardContent>
        <Divider />

        <CardContent
          className="pet-details"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Vaccines Section */}
          <Typography variant="subtitle1" gutterBottom>
            Vaccines
            <Tooltip
              title="Vaccines are a critical piece of information that tells us what diseases we're protecting our pet against."
              arrow
            >
              <IconButton size="small">
                <InfoIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Typography>
          {selectedPet.vaccines && selectedPet.vaccines.length > 0 ? (
            selectedPet.vaccines.map((vaccine, index) => (
              <Box
                className="pet-section"
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography variant="body2" sx={{ pl: 2 }}>
                  • {vaccine.name}, Date:{" "}
                  {new Date(vaccine.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleEdit("vaccine", index, selectedPet.vaccines[index])
                  }
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                {/* Add Create Button for Vaccines */}
                <IconButton
                  onClick={() => {
                    handleAddNew("vaccine");
                  }}
                >
                  <NoteAddIcon />
                </IconButton>
              </Box>
            ))
          ) : (
            <Box>
              <Typography variant="body2">N/A</Typography>
              <IconButton
                onClick={() => {
                  handleAddNew("vaccine");
                }}
              >
                <NoteAddIcon />
              </IconButton>
            </Box>
          )}

          <Typography variant="subtitle1" gutterBottom>
            Dewormings
            <Tooltip
              title="Dewormings are a reminder of the ongoing battle against parasites, ensuring the pet remains healthy and happy."
              arrow
            >
              <IconButton size="small">
                <InfoIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Typography>
          {selectedPet.deworming && selectedPet.deworming.length > 0 ? (
            selectedPet.deworming.map((deworming, index) => (
              <Box
                className="pet-section"
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography variant="body2" sx={{ pl: 2 }}>
                  • {deworming.type}, Date:{" "}
                  {new Date(deworming.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleEdit("deworming", index, selectedPet.deworming[index])
                  }
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleAddNew("deworming");
                  }}
                >
                  <NoteAddIcon />
                </IconButton>
              </Box>
            ))
          ) : (
            <Box>
              <Typography variant="body2">N/A</Typography>
              <IconButton
                onClick={() => {
                  handleAddNew("deworming");
                }}
              >
                <NoteAddIcon />
              </IconButton>
            </Box>
          )}
          {/* Observations Section */}
          <Divider />
          <Typography variant="subtitle1" gutterBottom>
            Observations
            <Tooltip
              title="Observations are a more personal space, where anything out of the ordinary is noted for future reference. Whether it's a change in appetite, a new playful habit, or a concern that needs veterinary attention, this diary holds the nuanced details of the pet's life."
              arrow
            >
              <IconButton size="small">
                <InfoIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Typography>
          {selectedPet.observations && selectedPet.observations.length > 0 ? (
            selectedPet.observations.map((observation, index) => (
              <Box
                key={index}
                className="pet-section"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography variant="body2" sx={{ pl: 2 }}>
                  • {observation.description}, Date:{" "}
                  {new Date(observation.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleEdit("observations", index, observation)}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleAddNew("observations");
                  }}
                >
                  <NoteAddIcon />
                </IconButton>
              </Box>
            ))
          ) : (
            <Box>
              <Typography variant="body2">N/A</Typography>
              <IconButton
                onClick={() => {
                  handleAddNew("observations");
                }}
              >
                <NoteAddIcon />
              </IconButton>
            </Box>
          )}
          {/* Add Create Button for Observations */}
        </CardContent>
      </CardContent>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Add New Observation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="observation-text"
            label="Observation Text"
            type="text"
            fullWidth
            value={observationData.text}
            onChange={(e) =>
              setObservationData({ ...observationData, text: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="observation-date"
            label="Date"
            type="date"
            fullWidth
            value={observationData.date.toISOString().split("T")[0]}
            onChange={(e) =>
              setObservationData({
                ...observationData,
                date: new Date(e.target.value),
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitObservation} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isVaccineModalOpen}
        onClose={() => setIsVaccineModalOpen(false)}
      >
        <DialogTitle>Add New Vaccine</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="vaccine-name"
            label="Vaccine Name"
            type="text"
            fullWidth
            value={newVaccineData.name}
            onChange={(e) =>
              setNewVaccineData({ ...newVaccineData, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="vaccine-date"
            label="Date"
            type="date"
            fullWidth
            value={newVaccineData.date.toISOString().split("T")[0]}
            onChange={(e) =>
              setNewVaccineData({
                ...newVaccineData,
                date: new Date(e.target.value),
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsVaccineModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitVaccine} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isDewormingModalOpen}
        onClose={() => setIsDewormingModalOpen(false)}
      >
        <DialogTitle>Add New Deworming</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="deworming-type"
            label="Deworming Type"
            type="text"
            fullWidth
            value={newDewormingData.type}
            onChange={(e) =>
              setNewDewormingData({ ...newDewormingData, type: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="deworming-date"
            label="Date"
            type="date"
            fullWidth
            value={newDewormingData.date.toISOString().split("T")[0]}
            onChange={(e) =>
              setNewDewormingData({
                ...newDewormingData,
                date: new Date(e.target.value),
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDewormingModalOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmitDeworming} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PetDetailsPage;
