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
import { useLoading } from "../context/LoadingContext.jsx";
import LoadingSpinner from "../LoadingSpinner.jsx";

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const { userDetails } = useAuth();
  const { isLoading, setIsLoading } = useLoading();
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    if (userDetails) {
      fetchUserDetails();
    }
  }, [userDetails]);

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}{" "}
      <Container
        display="flex"
        flexDirection={{ base: "column", md: "row" }} // Use column layout on smaller screens
        alignItems="center"
        justifyContent="center"
        minWidth="80vw" // Use 100vw for full width on all screen sizes
        p={{ base: "1rem", md: "2rem" }} // Adjust padding for different screen sizes
        mt={{ base: "0.5rem", md: "1rem" }} // Adjust top margin for different screen sizes
        borderRadius="12px"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
        position="relative"
      >
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          width="100%"
        >
          <Box
            flex={{ base: "1", md: "1" }}
            mr={{ base: "0", md: "2rem" }}
            mb={{ base: "2rem", md: "0" }}
          >
            <ProfileHeader
              user={user}
              onUserUpdate={handleUserUpdate}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              width="100%"
            />
          </Box>
          <Box flex={{ base: "1", md: "2" }}>
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
          <Box mt={4} textAlign={{ base: "center", md: "right" }} width="100%">
            <Button colorScheme="teal" onClick={() => setIsEditMode(false)}>
              Save Changes
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
};
export default Profile;
