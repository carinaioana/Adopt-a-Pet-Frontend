import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  TextField,
  Typography,
  IconButton, MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import "../../styles/Profile.css";
import { Stack } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import Announcement from "../Announcements/Announcement.jsx"


const ProfileDetails = ({ user, setUser }) => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddPetDialog, setOpenAddPetDialog] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [newPet, setNewPet] = useState({
    name: '',
    age: '',
    type: '',
    breed: '',
    sex: '',
    description: '',
    traits: [],
    image: '', // Assuming pets have an image property
  });

  const handleOpenAddPetDialog = () => {
    setNewPet({
      name: '',
      age: '',
      type: '',
      breed: '',
      sex: '',
      description: '',
      traits: [],
      image: '',
    });
    setOpenAddPetDialog(true);
  };

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
      try {
        const response = await axios.get(
            "https://localhost:7141/api/v1/Announc",
        );
        setAnnouncements(response.data.announcements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);



  const handleOpenDialog = (pet) => {
    setSelectedPet({ ...pet });
    setOpenDialog(true);
    setIsEditMode(false); // Ensure edit mode is reset/false when opening the dialog
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [isEditMode, setIsEditMode] = useState(false);

  const [newTrait, setNewTrait] = useState(''); // State to hold new trait value

  const handleSaveChanges = () => {
    const updatedPetProfiles = user.petProfiles.map((pet) =>
        pet.id === selectedPet.id ? selectedPet : pet
    );
    setUser({ ...user, petProfiles: updatedPetProfiles });
    setOpenDialog(false); // Close the dialog after saving changes
  };

  const [showNewTraitBox, setShowNewTraitBox] = useState(false);
  const handleAddTrait = () => {
    if (!newTrait.trim()) return; // Prevent adding empty traits
    const updatedTraits = [...selectedPet.traits, newTrait];
    setSelectedPet({ ...selectedPet, traits: updatedTraits });
    // Update the user's petProfiles array with the new trait
    const updatedPetProfiles = user.petProfiles.map((pet) =>
        pet.name === selectedPet.name ? { ...selectedPet, traits: updatedTraits } : pet
    );
    setUser({ ...user, petProfiles: updatedPetProfiles });
    setNewTrait(''); // Reset new trait input
  };


  return (
    <>
      <Card className="profile-section" variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          My Announcements
                </Typography>
        <List sx={{ overflow: "auto" }}>
          {Array.isArray(announcements) ? (
              announcements.map((announcement, index) => (
                  <Announcement
                      key={index}
                      title={announcement.announcementTitle}
                      content={announcement.announcementDescription}
                      date={new Date(announcement.announcementDate).toLocaleString(
                          "en-UK",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                      )}
                  />
              ))
          ) : (
              <Typography variant="body1">No announcements found.</Typography>
          )}
        </List>
      </CardContent>
    </Card>

      <Card className="profile-section" variant="outlined" sx={{ mt: 2 }}>
        <CardContent className="pet-profiles">
          <Typography variant="h5" component="h2" gutterBottom>
            Pet Profiles
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {user.petProfiles.map((pet, index) => (
                <Chip
                    key={index}
                    avatar={
                      <Avatar alt={pet.name} src="/static/images/avatar/1.jpg" />
                    } // Placeholder image, replace with actual pet photo if available
                    label={`${pet.name} (${pet.type})`}
                    variant="outlined"
                    onClick={() => handleOpenDialog(pet)}
                />
            ))}
           <IconButton color="primary" aria-label="add new pet" onClick={handleOpenAddPetDialog}>
                  <AddIcon />
           </IconButton>
          </Stack>

         <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
  <DialogTitle>
    {selectedPet ? `${selectedPet.name}'s Details` : ""}
  </DialogTitle>
  <DialogContent>
    {selectedPet && (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5}>
          <Avatar
            alt={selectedPet.name}
            src={selectedPet.image || "/static/images/avatar/1.jpg"}
            sx={{ width: 128, height: 128 }}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          {isEditMode ? (
            <>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="dense"
                value={selectedPet.name}
                onChange={(e) => {
                  const updatedPet = { ...selectedPet, name: e.target.value };
                  setSelectedPet(updatedPet);
                  // Update the user's petProfiles array with the updated pet details
                  const updatedPetProfiles = user.petProfiles.map((pet) =>
                    pet.name === selectedPet.name ? updatedPet : pet
                  );
                  setUser({ ...user, petProfiles: updatedPetProfiles });
                }}
              />
              <TextField
                fullWidth
                label="Age"
                variant="outlined"
                margin="dense"
                type="number"
                value={selectedPet.age.toString()}
                onChange={(e) => {
                  const updatedPet = { ...selectedPet, age: Number(e.target.value) };
                  setSelectedPet(updatedPet);
                  const updatedPetProfiles = user.petProfiles.map((pet) =>
                    pet.name === selectedPet.name ? updatedPet : pet
                  );
                  setUser({ ...user, petProfiles: updatedPetProfiles });
                }}
              />
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                margin="dense"
                value={selectedPet.type}
                onChange={(e) => {
                  const updatedPet = { ...selectedPet, type: e.target.value };
                  setSelectedPet(updatedPet);
                  const updatedPetProfiles = user.petProfiles.map((pet) =>
                    pet.name === selectedPet.name ? updatedPet : pet
                  );
                  setUser({ ...user, petProfiles: updatedPetProfiles });
                }}
              />
              <TextField
                fullWidth
                label="Breed"
                variant="outlined"
                margin="dense"
                value={selectedPet.breed}
                onChange={(e) => {
                  const updatedPet = { ...selectedPet, breed: e.target.value };
                  setSelectedPet(updatedPet);
                  const updatedPetProfiles = user.petProfiles.map((pet) =>
                    pet.name === selectedPet.name ? updatedPet : pet
                  );
                  setUser({ ...user, petProfiles: updatedPetProfiles });
                }}
              />
                            <TextField
                select
                fullWidth
                label="Sex"
                variant="outlined"
                margin="dense"
                value={selectedPet.sex}
                onChange={(e) => {
                  const updatedPet = { ...selectedPet, sex: e.target.value };
                  setSelectedPet(updatedPet);
                  const updatedPetProfiles = user.petProfiles.map((pet) =>
                    pet.name === selectedPet.name ? updatedPet : pet
                  );
                  setUser({ ...user, petProfiles: updatedPetProfiles });
                }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                margin="dense"
                multiline
                rows={4}
                value={selectedPet.description}
                onChange={(e) => {
                  const updatedPet = { ...selectedPet, description: e.target.value };
                  setSelectedPet(updatedPet);
                  const updatedPetProfiles = user.petProfiles.map((pet) =>
                    pet.name === selectedPet.name ? updatedPet : pet
                  );
                  setUser({ ...user, petProfiles: updatedPetProfiles });
                }}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                {selectedPet.traits.map((trait, index) => (
                    <Chip
                        key={index}
                        label={trait}
                        variant="outlined"
                        onDelete={isEditMode ? () => {
                          const updatedTraits = selectedPet.traits.filter((_, i) => i !== index);
                          setSelectedPet({ ...selectedPet, traits: updatedTraits });
                          const updatedPetProfiles = user.petProfiles.map((pet) =>
                              pet.name === selectedPet.name ? { ...selectedPet, traits: updatedTraits } : pet
                          );
                          setUser({ ...user, petProfiles: updatedPetProfiles });
                        } : undefined}
                        deleteIcon={<CloseIcon />}
                    />
                ))}
              {isEditMode && (
  <>
    {showNewTraitBox && (
      <TextField
        label="New Trait"
        variant="outlined"
        value={newTrait}
        onChange={(e) => setNewTrait(e.target.value)}
        size="small"
        sx={{ marginRight: 1 }}
      />
    )}

    <IconButton color="primary" aria-label="add new trait" onClick={() => {
      if (!showNewTraitBox) {
        setShowNewTraitBox(true);
      } else {
        handleAddTrait();
        setNewTrait(""); // Reset the input field after adding the trait
        setShowNewTraitBox(false); // Optionally hide the input field again after adding
      }
    }}>
      <AddIcon />
    </IconButton>
  </>
)}
              </Stack>
            </>
          ) : (
            <>
              <Typography variant="body1"><strong>Name:</strong> <Chip label={selectedPet.name}></Chip></Typography>
              <Typography variant="body1"><strong>Age:</strong><Chip label= {selectedPet.age}></Chip></Typography>
              <Typography variant="body1"><strong>Type:</strong> <Chip label={selectedPet.type}></Chip></Typography>
              <Typography variant="body1"><strong>Breed:</strong> <Chip label={selectedPet.breed}></Chip></Typography>
              <Typography variant="body1"><strong>Sex:</strong><Chip label= {selectedPet.sex}></Chip></Typography>
              <Typography variant="body1"><strong>Description:</strong> <Chip label= {selectedPet.description}></Chip></Typography>
              <Stack direction="row" spacing={1}> Traits:
                {selectedPet.traits.map((trait, index) => (
                  <Chip
                    key={index}
                    label={trait}
                  />
                ))}
              </Stack>
            </>
          )}
        </Grid>
      </Grid>
            )}
        </DialogContent>
<DialogActions>
  {isEditMode ? (
    <>
      <Button onClick={() => setIsEditMode(false)}>Cancel</Button>
      <Button onClick={handleSaveChanges}>Save</Button>
    </>
  ) : (
    <Button onClick={() => setIsEditMode(true)}>Edit</Button>
  )}
  <Button onClick={handleCloseDialog}>Close</Button>
</DialogActions>
</Dialog>
        </CardContent>
      </Card>
      <Dialog open={openAddPetDialog} onClose={() => setOpenAddPetDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Pet</DialogTitle>
        <DialogContent>
          <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="dense"
              value={newPet.name}
              onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
          />
          <TextField
              fullWidth
              label="Age"
              variant="outlined"
              margin="dense"
              type="number"
              value={newPet.age}
              onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
          />
          <TextField
              fullWidth
              label="Type"
              variant="outlined"
              margin="dense"
              value={newPet.type}
              onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
          />
          <TextField
              fullWidth
              label="Breed"
              variant="outlined"
              margin="dense"
              value={newPet.breed}
              onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
          />
          <TextField
              fullWidth
              label="Sex"
              variant="outlined"
              margin="dense"
              value={newPet.sex}
              onChange={(e) => setNewPet({ ...newPet, sex: e.target.value })}
          />
          <TextField
              fullWidth
              label="Description"
              variant="outlined"
              margin="dense"
              multiline
              rows={4}
              value={newPet.description}
              onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
          />
         {newPet.traits.map((trait, index) => (
  <Stack key={index} direction="row" spacing={1} alignItems="center">
    <TextField
      fullWidth
      label={`Trait ${index + 1}`}
      variant="outlined"
      margin="dense"
      value={trait}
      onChange={(e) => {
        const updatedTraits = [...newPet.traits];
        updatedTraits[index] = e.target.value;
        setNewPet({ ...newPet, traits: updatedTraits });
      }}
    />
      <IconButton
        aria-label="delete trait"
        onClick={() => {
          const updatedTraits = newPet.traits.filter((_, i) => i !== index);
          setNewPet({ ...newPet, traits: updatedTraits });
        }}
      >
        <CloseIcon />
      </IconButton>
    </Stack>
  ))}
      <Button
        onClick={() => setNewPet({ ...newPet, traits: [...newPet.traits, ''] })}
      >
        Add Trait
      </Button>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAddPetDialog(false)}>Cancel</Button>
                <Button onClick={() => {
                  setUser({ ...user, petProfiles: [...user.petProfiles, newPet] });
                  setOpenAddPetDialog(false);
                }}>Add</Button>
              </DialogActions>
            </Dialog>
          </>
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
  setUser: PropTypes.func.isRequired,
};

export default ProfileDetails;
