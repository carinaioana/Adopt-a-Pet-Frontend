import { useEffect, useState } from "react";
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
  IconButton,
  List,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import "../../styles/Profile.css";
import { Stack } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Announcement from "../Announcements/Announcement.jsx";

const ProfileDetails = ({ user, onUserUpdate }) => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddPetDialog, setOpenAddPetDialog] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

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
        const response = await axios.get(
          "https://localhost:7141/api/v1/Announc/my-announcements",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setAnnouncements(response.data.announcements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    // Fetch current user's details
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("authToken"); // Adjust if your token is stored differently
      try {
        const response = await axios.get(
          "https://localhost:7141/api/v1/Authentication/currentuserinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user details:", error);
      }
    };

    fetchCurrentUser();
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

  const [newTrait, setNewTrait] = useState(""); // State to hold new trait value

  const handleSaveChanges = () => {
    const updatedPetProfiles = user.petProfiles.map((pet) =>
      pet.id === selectedPet.id ? selectedPet : pet,
    );
    onUserUpdate({ ...user, petProfiles: updatedPetProfiles });
    setOpenDialog(false); // Close the dialog after saving changes
  };

  const [showNewTraitBox, setShowNewTraitBox] = useState(false);
  const handleAddTrait = () => {
    if (!newTrait.trim()) return; // Prevent adding empty traits
    const updatedTraits = [...selectedPet.traits, newTrait];
    setSelectedPet({ ...selectedPet, traits: updatedTraits });
    // Update the user's petProfiles array with the new trait
    const updatedPetProfiles = user.petProfiles.map((pet) =>
      pet.name === selectedPet.name
        ? { ...selectedPet, traits: updatedTraits }
        : pet,
    );
    onUserUpdate({ ...user, petProfiles: updatedPetProfiles });
    setNewTrait(""); // Reset new trait input
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    const token = localStorage.getItem("authToken"); // Adjust if your token is stored differently
    try {
      await axios.delete(
        `https://localhost:7141/api/v1/Announc/${announcementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // Update your state to reflect the deletion
      setAnnouncements(
        announcements.filter(
          (announcement) => announcement.announcementId !== announcementId,
        ),
      );
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
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
                  )}
                  username={
                    currentUser?.claims?.[
                      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                    ]
                  }
                  currentUserId={currentUser.userName}
                  announcementUserId={announcement.createdBy}
                  announcementId={announcement.announcementId}
                  onDelete={() =>
                    handleDeleteAnnouncement(announcement.announcementId)
                  }
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
          <Stack
            direction={{ xs: "column", sm: "row" }} // Column layout on xs screens, row layout on sm screens and above
            spacing={1}
            alignItems="center"
            sx={{ width: "100%", overflow: "auto" }} // Ensure the Stack takes full width and allows scrolling if necessary
          >
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
            <IconButton
              color="primary"
              aria-label="add new pet"
              onClick={handleOpenAddPetDialog}
            >
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
                            const updatedPet = {
                              ...selectedPet,
                              name: e.target.value,
                            };
                            setSelectedPet(updatedPet);
                            // Update the user's petProfiles array with the updated pet details
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
                        <TextField
                          fullWidth
                          label="Age"
                          variant="outlined"
                          margin="dense"
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
                        <TextField
                          fullWidth
                          label="Type"
                          variant="outlined"
                          margin="dense"
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
                        />
                        <TextField
                          fullWidth
                          label="Breed"
                          variant="outlined"
                          margin="dense"
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
                        />
                        <TextField
                          select
                          fullWidth
                          label="Sex"
                          variant="outlined"
                          margin="dense"
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
                        <Stack direction="row" spacing={1} alignItems="center">
                          {selectedPet.traits.map((trait, index) => (
                            <Chip
                              key={index}
                              label={trait}
                              variant="outlined"
                              onDelete={
                                isEditMode
                                  ? () => {
                                      const updatedTraits =
                                        selectedPet.traits.filter(
                                          (_, i) => i !== index,
                                        );
                                      setSelectedPet({
                                        ...selectedPet,
                                        traits: updatedTraits,
                                      });
                                      const updatedPetProfiles =
                                        user.petProfiles.map((pet) =>
                                          pet.name === selectedPet.name
                                            ? {
                                                ...selectedPet,
                                                traits: updatedTraits,
                                              }
                                            : pet,
                                        );
                                      onUserUpdate({
                                        ...user,
                                        petProfiles: updatedPetProfiles,
                                      });
                                    }
                                  : undefined
                              }
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

                              <IconButton
                                color="primary"
                                aria-label="add new trait"
                                onClick={() => {
                                  if (!showNewTraitBox) {
                                    setShowNewTraitBox(true);
                                  } else {
                                    handleAddTrait();
                                    setNewTrait(""); // Reset the input field after adding the trait
                                    setShowNewTraitBox(false); // Optionally hide the input field again after adding
                                  }
                                }}
                              >
                                <AddIcon />
                              </IconButton>
                            </>
                          )}
                        </Stack>
                      </>
                    ) : (
                      <>
                        <Typography variant="body1">
                          <strong>Name:</strong>{" "}
                          <Chip label={selectedPet.name}></Chip>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Age:</strong>
                          <Chip label={selectedPet.age}></Chip>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Type:</strong>{" "}
                          <Chip label={selectedPet.type}></Chip>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Breed:</strong>{" "}
                          <Chip label={selectedPet.breed}></Chip>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Sex:</strong>
                          <Chip label={selectedPet.sex}></Chip>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Description:</strong>{" "}
                          <Chip label={selectedPet.description}></Chip>
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          {" "}
                          Traits:
                          {selectedPet.traits.map((trait, index) => (
                            <Chip key={index} label={trait} />
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
      <Dialog
        open={openAddPetDialog}
        onClose={() => setOpenAddPetDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Pet</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="dense"
                value={newPet.name}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Age"
                variant="outlined"
                margin="dense"
                type="number"
                value={newPet.age}
                onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                margin="dense"
                value={newPet.type}
                onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Breed"
                variant="outlined"
                margin="dense"
                value={newPet.breed}
                onChange={(e) =>
                  setNewPet({ ...newPet, breed: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sex"
                variant="outlined"
                margin="dense"
                select
                value={newPet.sex}
                onChange={(e) => setNewPet({ ...newPet, sex: e.target.value })}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                margin="dense"
                multiline
                rows={4}
                value={newPet.description}
                onChange={(e) =>
                  setNewPet({ ...newPet, description: e.target.value })
                }
              />
            </Grid>
            {newPet.traits.map((trait, index) => (
              <Grid item xs={12} key={index}>
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
                    const updatedTraits = newPet.traits.filter(
                      (_, i) => i !== index,
                    );
                    setNewPet({ ...newPet, traits: updatedTraits });
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={() =>
                  setNewPet({ ...newPet, traits: [...newPet.traits, ""] })
                }
                startIcon={<AddIcon />}
              >
                Add Trait
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPetDialog(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              const petData = {
                animalType: newPet.type,
                animalName: newPet.name,
                animalDescription: newPet.description,
                personalityTraits: newPet.traits,
                animalAge: parseInt(newPet.age, 10), // Ensure age is an integer
                animalBreed: newPet.breed,
                imageUrl: newPet.image, // Ensure you have a way to set this, e.g., from a file upload
                animalSex: newPet.sex,
              };
              const authToken = localStorage.getItem("authToken");
              try {
                const response = await axios.post(
                  "https://localhost:7141/api/v1/Animals",
                  petData,
                  {
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                      "Content-Type": "application/json",
                    },
                  },
                );
                console.log("Successfully added the pet:", response.data);
                // Assuming you want to update the user's petProfiles with the newly added pet
                // and assuming the API returns the updated pet object including any server-generated fields like an ID
                onUserUpdate({
                  ...user,
                  petProfiles: [...user.petProfiles, response.data],
                });
                setOpenAddPetDialog(false);
              } catch (error) {
                console.error("Error adding the new pet:", error);
              }
            }}
          >
            Add
          </Button>
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
  onUserUpdate: PropTypes.func.isRequired,
};

export default ProfileDetails;
