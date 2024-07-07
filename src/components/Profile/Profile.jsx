import { useEffect, useState } from "react";
import { Box, Button, Container, Flex } from "@chakra-ui/react";
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
        const token = localStorage.getItem("authToken");

        const userId = userDetails.id;
        console.log(userDetails);

        const petProfilesResponse = await axios.get(
          "https://localhost:7141/api/v1/Animals/my-animals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(petProfilesResponse);

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
          id: userId,
          username: userDetails.username,
          profilePhoto: userDetails.profilePhoto,
          fullName: userDetails.name,
          email: userDetails.email,
          birthDate: userDetails.birthDate,
          userLocation: { selectedLocation: userDetails.location },
          description: userDetails.description,
          phoneNumber: userDetails.phoneNumber,
          petProfiles: petProfiles,
        };
        console.log(userInfo);
        setUser((prevUser) => {
          console.log(prevUser);
          return userInfo;
        });
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
  if (user === null) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Box
        width="100vw"
        maxWidth="100%"
        px={{ base: "1rem", sm: "2rem", md: "3rem", lg: "4rem" }}
        mt={{ base: "0.5rem", md: "1rem" }}
      >
        <Box
          width="100%"
          borderRadius="12px"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="sm"
          p={{ base: "1rem", sm: "1.5rem", md: "2rem" }}
        >
          <Flex direction="column" gap="1rem">
            <Box width="100%">
              <ProfileHeader
                user={user}
                onUserUpdate={handleUserUpdate}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
              />
            </Box>
            <Box width="100%">
              <ProfileDetails
                user={user}
                onUserUpdate={handleUserUpdate}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
              />
            </Box>
          </Flex>
          {isEditMode && (
            <Box mt={4} textAlign="right">
              <Button colorScheme="teal" onClick={() => setIsEditMode(false)}>
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
export default Profile;
