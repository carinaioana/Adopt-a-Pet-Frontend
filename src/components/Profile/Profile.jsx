import { useEffect, useState } from "react";
import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import "../../styles/Profile.css";
import "../../styles/App.css";
import ProfileHeader from "./ProfileHeader.jsx";
import ProfileDetails from "./ProfileDetails.jsx";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const { userDetails } = useAuth();
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
        // Fetch pet profiles
        const petProfilesResponse = await axios.get(
          "https://localhost:7141/api/v1/Animals/my-animals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const petProfiles = petProfilesResponse.data.animals.map((pet) => ({
          id: pet.animalId,
          name: pet.animalName,
          type: pet.animalType,
          breed: pet.animalBreed,
          sex: pet.animalSex,
          age: pet.animalAge,
          description: pet.animalDescription,
          traits: pet.personalityTraits,
          image: pet.imageUrl,
        }));

        const userInfo = {
          id: userDetails.id,
          username: userDetails.username,
          profilePhoto: "src/assets/carina.jpg",
          fullName: userDetails.name,
          email: userDetails.email,
          age: 21,
          userLocation: { selectedLocation: "" },
          description: "Loves hiking and outdoor activities.",
          petProfiles: petProfiles,
        };

        setUser(userInfo);
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
        marginTop: "5rem",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        position: "relative",
      }}
      className="common-container"
    >
      <CardContent variant="oulined" className="common-header">
        <ProfileHeader
          user={user}
          onUserUpdate={handleUserUpdate}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      </CardContent>
      <CardContent variant="outlined" className="common-details">
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
