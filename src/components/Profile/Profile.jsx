import { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import "../../styles/Profile.css";
import ProfileHeader from "./ProfileHeader.jsx";
import ProfileDetails from "./ProfileDetails.jsx";
import axios from "axios";

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };
  useEffect(() => {
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
      const userDetailsResponse = await axios.get('https://localhost:7141/api/v1/Authentication/currentuserinfo', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const claims = userDetailsResponse.data.claims;

      const name = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userId = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];


      // Fetch pet profiles
      const petProfilesResponse = await axios.get('https://localhost:7141/api/v1/Animals/my-animals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const petProfiles = petProfilesResponse.data.animals.map(pet => ({
        animalId: pet.animalId,
        animalName: pet.animalName,
        animalType: pet.animalType,
        animalBreed: pet.animalBreed,
        animalSex: pet.animalSex,
        animalAge: pet.animalAge,
        animalDescription: pet.animalDescription,
        personalityTraits: pet.personalityTraits,
        imageUrl: pet.imageUrl,
      }));

      const userDetails = {
        id: userId,
        username: "carinasrb",
        profilePhoto: "https://via.placeholder.com/150",
        fullName: name,
        email: "jane.doe@example.com",
        age: 30,
        userLocation: { selectedLocation: "" },
        description: "Loves hiking and outdoor activities.",
        petProfiles: petProfiles,
      };

      setUser(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  fetchUserDetails();
}, []);

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Card
      sx={{
        margin: "2rem",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
      className="profile-container"
    >
      <CardContent variant="oulined" className="profile-header">
        <ProfileHeader
          user={user}
          onUserUpdate={handleUserUpdate}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      </CardContent>
      <CardContent variant="outlined" className="profile-details">
        <ProfileDetails
          user={user}
          onUserUpdate={handleUserUpdate}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      </CardContent>
      {isEditMode && (
        <div className="save-changes-button-wrapper">
          <Button
            className="save-changes-button"
            variant="contained"
            onClick={() => setIsEditMode(false)}
          >
            Save Changes
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Profile;
