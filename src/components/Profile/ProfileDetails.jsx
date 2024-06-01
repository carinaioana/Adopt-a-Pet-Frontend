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
  IconButton,
  MenuItem,
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
    animalName: "",
    animalAge: "",
    animalType: "",
    animalBreed: "",
    animalSex: "",
    animalDescription: "",
    personalityTraits: [],
    imageUrl: "", // Assuming pets have an image property
  });

  const handleOpenAddPetDialog = () => {
    setNewPet({
      animalName: "",
      animalAge: "",
      animalType: "",
      animalBreed: "",
      animalSex: "",
      animalDescription: "",
      personalityTraits: [],
      imageUrl: "",
    });
    setOpenAddPetDialog(true);
  };

  useEffect(() => {
    if (selectedPet) {
      const currentPet = user.petProfiles.find(
        (pet) => pet.animalName === selectedPet.animalName,
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
    handleUpdatePet().then(setOpenDialog(false));

  };

  const [showNewTraitBox, setShowNewTraitBox] = useState(false);
  const handleAddTrait = () => {
    if (!newTrait.trim()) return; // Prevent adding empty traits
    const updatedTraits = [...selectedPet.personalityTraits, newTrait];
    setSelectedPet({ ...selectedPet, personalityTraits: updatedTraits });
    // Update the user's petProfiles array with the new trait
    const updatedPetProfiles = user.petProfiles.map((pet) =>
      pet.animalName === selectedPet.animalName
        ? { ...selectedPet, personalityTraits: updatedTraits }
        : pet,
    );
    onUserUpdate({ ...user, petProfiles: updatedPetProfiles });
    setNewTrait(""); // Reset new trait input
  };
 /* const fetchPetDetails = async (petId) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`https://localhost:7141/api/v1/Animals/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedPet(response.data); // Assuming response.data contains the pet details
      setIsEditMode(true); // Switch to edit mode
    } catch (error) {
      console.error("Error fetching pet details:", error);
    }
  };*/
  const handleUpdatePet = async () => {
    const token = localStorage.getItem("authToken");
    const petData = {
      ...selectedPet, // Spread the updated pet details
      // Any transformations needed for the API
    };
    console.log(petData);
    try {
      await axios.put(`https://localhost:7141/api/v1/Animals/${selectedPet.animalId}`, petData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Pet updated successfully");
      // Optionally, refresh the pet list or close the edit dialog
      setIsEditMode(false); // Exit edit mode
      // You might want to fetch the updated list of pets here or update the UI accordingly
    } catch (error) {
      console.error("Error updating the pet:", error);
    }
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
                  <Avatar alt={pet.animalName} src="/static/images/avatar/1.jpg" />
                } // Placeholder image, replace with actual pet photo if available
                label={`${pet.animalName} (${pet.animalType})`}
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
              {selectedPet ? `${selectedPet.animalName}'s Details` : ""}
            </DialogTitle>
            <DialogContent>
              {selectedPet && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={5}>
                    <Avatar
                      alt={selectedPet.animalName}
                      src={selectedPet.imageUrl || "/static/images/avatar/1.jpg"}
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
                          value={selectedPet.animalName}
                          onChange={(e) => {
                            const updatedPet = {
                              ...selectedPet,
                              animalName: e.target.value,
                            };
                            setSelectedPet(updatedPet);
                             const updatedPetProfiles = user.petProfiles.map(
                              (pet) =>
                                pet.animalName === selectedPet.animalName
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
                          value={selectedPet.animalAge.toString()}
                          onChange={(e) => {
                            const updatedPet = {
                              ...selectedPet,
                              animalAge: Number(e.target.value),
                            };
                            setSelectedPet(updatedPet);
                            const updatedPetProfiles = user.petProfiles.map(
                              (pet) =>
                                pet.animalName === selectedPet.animalName
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
                          value={selectedPet.animalType}
                          onChange={(e) => {
                            const updatedPet = {
                              ...selectedPet,
                              animalType: e.target.value,
                            };
                            setSelectedPet(updatedPet);
                            const updatedPetProfiles = user.petProfiles.map(
                              (pet) =>
                                pet.animalName === selectedPet.animalName
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
                          value={selectedPet.animalBreed}
                          onChange={(e) => {
                            const updatedPet = {
                              ...selectedPet,
                              animalBreed: e.target.value,
                            };
                            setSelectedPet(updatedPet);
                            const updatedPetProfiles = user.petProfiles.map(
                              (pet) =>
                                pet.animalName === selectedPet.animalName
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
                          value={selectedPet.animalSex}
                          onChange={(e) => {
                            const updatedPet = {
                              ...selectedPet,
                              animalSex: e.target.value,
                            };
                            setSelectedPet(updatedPet);
                            const updatedPetProfiles = user.petProfiles.map(
                              (pet) =>
                                pet.animalName === selectedPet.animalName
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
                          value={selectedPet.animalDescription}
                          onChange={(e) => {
                            const updatedPet = {
                              ...selectedPet,
                              animalDescription: e.target.value,
                            };
                            setSelectedPet(updatedPet);
                            const updatedPetProfiles = user.petProfiles.map(
                              (pet) =>
                                pet.animalName === selectedPet.animalName
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
                          {selectedPet.personalityTraits.map((trait, index) => (
                            <Chip
                              key={index}
                              label={trait}
                              variant="outlined"
                              onDelete={
                                isEditMode
                                  ? () => {
                                      const updatedTraits =
                                        selectedPet.personalityTraits.filter(
                                          (_, i) => i !== index,
                                        );
                                      setSelectedPet({
                                        ...selectedPet,
                                        personalityTraits: updatedTraits,
                                      });
                                      const updatedPetProfiles =
                                        user.petProfiles.map((pet) =>
                                          pet.animalName === selectedPet.animalName
                                            ? {
                                                ...selectedPet,
                                                personalityTraits: updatedTraits,
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
                          <Chip label={selectedPet.animalName}></Chip>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Age:</strong>
                          <Chip label={selectedPet.animalAge}></Chip>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Type:</strong>{" "}
                          <Chip label={selectedPet.animalType}></Chip>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Breed:</strong>{" "}
                          <Chip label={selectedPet.animalBreed}></Chip>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Sex:</strong>
                          <Chip label={selectedPet.animalSex}></Chip>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Description:</strong>{" "}
                          <Chip label={selectedPet.animalDescription}></Chip>
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          {" "}
                          Traits:
                          {selectedPet.personalityTraits.map((trait, index) => (
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
                value={newPet.animalName}
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
                value={newPet.animalAge}
                onChange={(e) => setNewPet({ ...newPet, animalAge: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                margin="dense"
                value={newPet.animalType}
                onChange={(e) => setNewPet({ ...newPet, animalType: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Breed"
                variant="outlined"
                margin="dense"
                value={newPet.animalBreed}
                onChange={(e) =>
                  setNewPet({ ...newPet, animalBreed: e.target.value })
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
                value={newPet.animalSex}
                onChange={(e) => setNewPet({ ...newPet, animalSex: e.target.value })}
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
                value={newPet.animalDescription}
                onChange={(e) =>
                  setNewPet({ ...newPet, animalDescription: e.target.value })
                }
              />
            </Grid>
            {newPet.personalityTraits.map((trait, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Trait ${index + 1}`}
                  variant="outlined"
                  margin="dense"
                  value={trait}
                  onChange={(e) => {
                    const updatedTraits = [...newPet.personalityTraits];
                    updatedTraits[index] = e.target.value;
                    setNewPet({ ...newPet, personalityTraits: updatedTraits });
                  }}
                />
                <IconButton
                  aria-label="delete trait"
                  onClick={() => {
                    const updatedTraits = newPet.personalityTraits.filter(
                      (_, i) => i !== index,
                    );
                    setNewPet({ ...newPet, personalityTraits: updatedTraits });
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={() =>
                  setNewPet({ ...newPet, personalityTraits: [...newPet.personalityTraits, ""] })
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
                animalType: newPet.animalType,
                animalName: newPet.animalName,
                animalDescription: newPet.animalDescription,
                personalityTraits: newPet.personalityTraits,
                animalAge: parseInt(newPet.animalAge, 10), // Ensure age is an integer
                animalBreed: newPet.animalBreed,
                imageUrl: newPet.imageUrl, // Ensure you have a way to set this, e.g., from a file upload
                animalSex: newPet.animalSex,
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
