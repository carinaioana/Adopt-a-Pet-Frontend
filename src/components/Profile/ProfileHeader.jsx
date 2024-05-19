import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
} from "react-google-places-autocomplete";
import { useTheme } from "@mui/material/styles";
import "../../styles/Profile.css";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

const ProfileHeader = ({ user, setUser }) => {
  const theme = useTheme();
  const [selectedLocation, setSelectedLocation] = useState(
    user.userLocation.selectedLocation,
  );
  const [openModal, setOpenModal] = useState(false);

  const handleLocationChange = (value) => {
    geocodeByPlaceId(value.value.place_id)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setUser({
          ...user,
          userLocation: { selectedLocation: value.label, lat, lng },
        });
      });
    setSelectedLocation(value);
  };
  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };
  return (
    <>
        <Box>
            <Box
                sx={{
                    position: 'relative', // This makes the Box a reference point for positioning the IconButton absolutely
                    display: 'inline-block', // This makes the Box fit its contents, allowing precise positioning of the IconButton
                }}
            >
                <Box
                    component="img"
                    src={user.profilePhoto}
                    alt="profile-photo"
                    sx={{
                        width: 250, // or any other size
                        height: 250,
                        borderRadius: "50%", // makes it circular, remove for square images
                    }}
                />
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 0, // Adjust these values as needed to position the icon correctly
                        right: 0,
                        backgroundColor: 'white', // Optional: Adds background color to the button for better visibility
                        '&:hover': {
                            backgroundColor: 'white', // Maintains the background color on hover
                        },
                    }}
                    onClick={() => {
                        // Define what happens when the button is clicked, e.g., open a modal to change the profile photo
                        console.log('Edit profile photo');
                    }}
                >
                    <EditIcon color="primary" />
                </IconButton>
            </Box>
          <Typography variant="h4" gutterBottom>
            {user.fullName}
          </Typography>

          <Typography variant="subtitle1">@{user.username}</Typography>

          <Card className="profile-section" variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                About Me
              </Typography>
              <Typography>{user.description}</Typography>
              <Typography>E-mail: {user.email}</Typography>
              <Typography>Age: {user.age.toString()}</Typography>
              <Typography>From {user.userLocation.selectedLocation}</Typography>
              <Button
                  variant="contained"
                  color="primary"
                  onClick={handleToggleModal}
                  sx={{ mt: 2 }} // Adjust margin top as needed
              >
                Edit details
              </Button>
            </CardContent>
          </Card>
        </Box>
        <Dialog open={openModal} onClose={handleToggleModal}>
          <DialogTitle>Edit User Details</DialogTitle>
           <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="fullName"
                label="Full Name"
                type="text"
                fullWidth
                variant="outlined"
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              />
              <TextField
                margin="dense"
                id="username"
                label="Username"
                type="text"
                fullWidth
                variant="outlined"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
              <TextField
                margin="dense"
                id="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <TextField
                margin="dense"
                id="age"
                label="Age"
                type="number"
                fullWidth
                variant="outlined"
                value={user.age.toString()}
                onChange={(e) => setUser({ ...user, age: parseInt(e.target.value, 10) })}
              />
              <TextField
                margin="dense"
                id="description"
                label="Description"
                type="text"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={user.description}
                onChange={(e) => setUser({ ...user, description: e.target.value })}
              />
              <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                selectProps={{
                  value: selectedLocation,
                  onChange: handleLocationChange,
                  styles: {
                    input: (provided) => ({
                      ...provided,
                      color: theme.palette.text.primary,
                    }),
                    option: (provided) => ({
                      ...provided,
                      color: theme.palette.text.primary,
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: theme.palette.text.primary,
                    }),
                  },
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleToggleModal}>Cancel</Button>
              <Button onClick={() => {
                handleToggleModal();
                console.log('Save changes');
                // Implement save logic here
              }}>Save</Button>
            </DialogActions>
      </Dialog>
    </>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string,
    username: PropTypes.string,
    userLocation: PropTypes.object,
    selectedLocation: PropTypes.string,
    profilePhoto: PropTypes.string,
    description: PropTypes.string,
    email: PropTypes.string,
    age: PropTypes.number,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default ProfileHeader;
