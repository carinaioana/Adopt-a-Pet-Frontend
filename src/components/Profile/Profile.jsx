import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CircularProgress,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
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
    <Container
      display="flex"
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
      <Box display="flex" width="100%">
        <Box flex="1" mr="2rem">
          <ProfileHeader
            user={user}
            onUserUpdate={handleUserUpdate}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            width="100%"
          />
        </Box>
        <Box flex="2">
          <ProfileDetails
            user={user}
            onUserUpdate={handleUserUpdate}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            width="100%"
          />
        </Box>
      </Box>

      {isEditMode && (
        <Box mt={4} textAlign="right">
          <Button colorScheme="teal" onClick={() => setIsEditMode(false)}>
            Save Changes
          </Button>
        </Box>
      )}
    </Container>
  );
};
export default Profile;
