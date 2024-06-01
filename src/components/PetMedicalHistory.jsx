import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
  Divider,
  CircularProgress, Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EditModal from "./EditModal.jsx"; // Assuming you're using react-router for navigation
import "../styles/PetProfile.css";
import NoteAddIcon from '@mui/icons-material/NoteAdd'; // Add this import at the beginning of your file
import InfoIcon from '@mui/icons-material/Info';
const EditableField = ({ label, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    onSave(editedValue);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditedValue(value);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            label={label}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            variant="outlined"
          />
          <IconButton onClick={handleSave}>
            <SaveIcon />
          </IconButton>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>
            {label}: {value}
          </Typography>
          <IconButton onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
};

const PetDetailsPage = () => {
  const navigate = useNavigate();
  const { petId } = useParams();
  const [selectedPet, setSelectedPet] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editContext, setEditContext] = useState({
    type: "",
    index: -1,
    value: {},
  });

  const handleSaveField = (field, value) => {
    // Update logic for selectedPet based on field and value
    console.log(`Saving ${field} with value ${value}`);
    // Here you would typically update the state or make an API call to save the updated value
    setSelectedPet((prev) => ({ ...prev, [field]: value }));
  };
  const handleAddNew = (type) => {
    setEditContext({ type, index: -1, value: {}, addingNew: true });
    setEditModalOpen(true);
  };
  const handleEdit = (type, index, value) => {
    setEditContext({ type, index, value });
    setEditModalOpen(true);
  };

  useEffect(() => {
    // Mock fetch operation
    const fetchPetDetails = async () => {
      // Simulated delay to mimic fetch operation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace this with actual data structure from your backend
      const mockPetDetails = {
        id: petId,
        userId: "Stefan",
        name: "Buddy",
        species: "Dog",
        age: 5,
        vaccines: [
          { name: "Rabies", date: "2021-04-14"},
          { name: "Distemper", date: "2021-05-22"},
        ],
        deworming: [
          { date: "2022-03-11", dewormingType: "External" },
          { date: "2022-09-11", dewormingType: "Internal" },
        ],
        observations: [
          {
            description: "Very friendly and loves to play fetch.",
            date: "2022-10-01"
          },
          {
            description: "Had a slight limp after playing in the park.",
            date: "2023-01-15"
          }
        ]};

      setSelectedPet(mockPetDetails);
    };

    fetchPetDetails();
  }, [petId]);
  if (!selectedPet) {
    // Show loading or handle the lack of a selected pet appropriately
    return <CircularProgress />;
  }

  return (
    <Box
      className="pet-details-container"
      sx={{ margin: "2rem", padding: "1.25rem" }}
    >
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent className="pet-details-header">
          <Avatar
            className="pet-photo"
            src={selectedPet.profilePhoto}
            alt={selectedPet.name}
            sx={{ width: 90, height: 90, mb: 2 }}
          />
          <Typography
            className="pet-info"
            variant="h5"
            component="h2"
            gutterBottom
          >
            {selectedPet.name}&apos;s Medical Card
        </Typography>
<Box sx={{ width: "100%" }}>
  <Typography variant="h6" gutterBottom>
    Owner Details:
  </Typography>
  <List className="pet-info">
    <ListItem>
      <ListItemText primary="Owner" secondary={selectedPet.userId} />
    </ListItem>
  </List>
  <Divider sx={{ my: 2 }} />
  <Typography variant="h6" gutterBottom>
    Animal Details:
  </Typography>
  <List className="pet-info">
    <ListItem>
      <ListItemText primary="Species" secondary={selectedPet.species} />
    </ListItem>

    <ListItem>
      <ListItemText primary="Age" secondary={`${selectedPet.age} years`} />
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
  <Tooltip title="Vaccines are a critical piece of information that tells us what diseases we're protecting our pet against." arrow>
  <IconButton size="small">
    <InfoIcon fontSize="inherit" />
  </IconButton>
</Tooltip>
</Typography>
{selectedPet.vaccines.length > 0 ? (
  selectedPet.vaccines.map((vaccine, index) => (
    <Box
      className="pet-section"
      key={index}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <Typography variant="body2" sx={{ pl: 2 }}>
        • {vaccine.name}, Date: {vaccine.date}
      </Typography>
      <IconButton
        size="small"
        onClick={() =>
          handleEdit("vaccine", index, selectedPet.vaccines[index])
        }
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  ))
) : (
  <Typography variant="body2">N/A</Typography>
)}
{/* Add Create Button for Vaccines */}
<IconButton onClick={() => {handleAddNew("vaccine")}}>
  <NoteAddIcon />
</IconButton>

{/* Deworming Section */}
  <Typography variant="subtitle1" gutterBottom>
    Dewormings
    <Tooltip title="Dewormings are a reminder of the ongoing battle against parasites, ensuring the pet remains healthy and happy." arrow>
      <IconButton size="small">
        <InfoIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  </Typography>
{selectedPet.deworming.length > 0 ? (
  selectedPet.deworming.map((deworming, index) => (
    <Box
      className="pet-section"
      key={index}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <Typography variant="body2" sx={{ pl: 2 }}>
        • {deworming.dewormingType}, Date: {deworming.date}
      </Typography>
      <IconButton
        size="small"
        onClick={() =>
          handleEdit("deworming", index, selectedPet.deworming[index])
        }
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  ))
) : (
  <Typography variant="body2">N/A</Typography>
)}
{/* Observations Section */}
<Divider sx={{ my: 2 }} />
<Typography variant="subtitle1" gutterBottom>
  Observations
    <Tooltip title="Observations are a more personal space, where anything out of the ordinary is noted for future reference. Whether it's a change in appetite, a new playful habit, or a concern that needs veterinary attention, this diary holds the nuanced details of the pet's life." arrow>
    <IconButton size="small">
      <InfoIcon fontSize="inherit" />
    </IconButton>
  </Tooltip>
</Typography>
{selectedPet.observations.length > 0 ? (
  selectedPet.observations.map((observation, index) => (
    <Box
      key={index}
      className="pet-section"
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <Typography variant="body2" sx={{ pl: 2 }}>
        • {observation.description}, Date: {observation.date}
      </Typography>
      <IconButton
        size="small"
        onClick={() => handleEdit("observations", index, observation)}
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  ))
) : (
  <Typography variant="body2">N/A</Typography>
)}
{/* Add Create Button for Observations */}
<IconButton onClick={() => {handleAddNew("observations")}}>
  <NoteAddIcon />
</IconButton>
</CardContent>
</Card>

      <EditModal
        open={editModalOpen}
        context={editContext}
        onClose={() => setEditModalOpen(false)}
       onSave={(newValue) => {
  if (editContext.addingNew) {
    // Handle adding new item
    if (editContext.type === "vaccine") {
      const updatedVaccines = [...selectedPet.vaccines, newValue];
      setSelectedPet({ ...selectedPet, vaccines: updatedVaccines });
    } else if (editContext.type === "deworming") {
      const updatedDeworming = [...selectedPet.deworming, newValue];
      setSelectedPet({ ...selectedPet, deworming: updatedDeworming });
    } else if (editContext.type === "observations") {
      // Directly set the observations string to the new value
      setSelectedPet({ ...selectedPet, observations: newValue });
    }
  } else {
    // Existing item update logic
    if (editContext.type === "vaccine") {
      const updatedVaccines = [...selectedPet.vaccines];
      updatedVaccines[editContext.index] = newValue;
      setSelectedPet({ ...selectedPet, vaccines: updatedVaccines });
    } else if (editContext.type === "deworming") {
      const updatedDeworming = [...selectedPet.deworming];
      updatedDeworming[editContext.index] = newValue;
      setSelectedPet({ ...selectedPet, deworming: updatedDeworming });
    } else if (editContext.type === "observations") {
      // Since observations is a single string, directly update it
      setSelectedPet({ ...selectedPet, observations: newValue });
    }
  }
  setEditModalOpen(false);
}}
      />
    </Box>
  );
};

export default PetDetailsPage;
