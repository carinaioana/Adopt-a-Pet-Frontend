import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import "../../styles/Profile.css";
import ProfileHeader from "./ProfileHeader.jsx";
import EditIcon from "@mui/icons-material/Edit";
import ProfileDetails from "./ProfileDetails.jsx";

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState(null);
  /*id: 1,
                      username: "johndoe",
                      email: "johndoe@example.com",
                      password: "password123",
                      fullName: "John Doe",
                      userLocation: { selectedLocation: "New York, USA" },
                      age: 30,
                      description: "Hi, I am a software developer.",
                      announcements: [
                        { title: "Found dog in Iasi" },
                        { title: "2 kittens looking for parents" },
                      ],
                      petProfiles: [
                        {
                          name: "Buddy",
                          species: "Dog",
                          description: "Loyal and friendly companion",
                          race: "Golden Retriever",
                          age: 5,
                          traits: ["Friendly", "Energetic", "Loyal"],
                        },
                        { name: "Whiskers", species: "Cat" },
                      ],
                      profilePhoto: "https://via.placeholder.com/150",
                    });*/
  useEffect(() => {
    const fetchUserDetails = async () => {
      // Simulated delay to mimic fetch operation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace this with actual data structure from your backend
      const mockUserDetails = {
        id: 1,
        username: "jane.doe",
        fullName: "Jane Doe",
        email: "jane.doe@example.com",
        password: "password123",
        age: 30,
        userLocation: { selectedLocation: "" },
        description: "Loves hiking and outdoor activities.",
        announcements: [
          { title: "Found dog in Iasi" },
          { title: "2 kittens looking for parents" },
        ],
        petProfiles: [
          {
            name: "Buddy",
            type: "Dog",
            breed: "Labrador",
            sex: "Male",
            age: 5,
            description: "Loyal and friendly companion",
            traits: ["Friendly", "Energetic", "Loyal"],
            image: "https://via.placeholder.com/150",
          },
        ],
        profilePhoto: "https://via.placeholder.com/150",
      };

      setUser(mockUserDetails); // Assuming setUser is the state setter function for user details
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
          setUser={setUser}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      </CardContent>
      <CardContent variant="outlined" className="profile-details">
        <ProfileDetails
          user={user}
          setUser={setUser}
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
