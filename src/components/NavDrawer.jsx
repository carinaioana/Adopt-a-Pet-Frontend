import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Switch,
  Text,
  useDisclosure,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorMode,
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  HamburgerIcon,
  CloseIcon,
  UnlockIcon,
  LockIcon,
} from "@chakra-ui/icons";
import { useAuth } from "./context/AuthContext.jsx";
import axios from "axios";
import "../styles/Header.css";
import "../styles/App.css";
import { AiOutlineLogout, AiOutlineLogin } from "react-icons/ai";
import { useLocation, useParams } from "react-router-dom";

const NavDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPetsAccordionExpanded, setIsPetsAccordionExpanded] = useState(false);
  const { logout, authToken, userDetails } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const isLoggedIn = !!authToken;
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const { selectedPet } = location.state || {};

  useEffect(() => {
    const fetchPetProfiles = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://localhost:7141/api/v1/Animals/my-animals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setPets(response.data.animals);
      } catch (error) {
        console.error("Error fetching pet profiles:", error);
      }
    };

    fetchPetProfiles();
  }, []);

  const handlePetClick = (petId) => {
    const selectedPet = pets.find((pet) => pet.animalId === petId);
    if (selectedPet) {
      navigate(`/pet-details/${selectedPet.animalId}`, {
        state: { selectedPet, key: Date.now() }, // Adding a unique key to the state
      });
    } else {
      console.error("Pet not found");
    }
  };

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate("/login");
    }
  };

  let navItems = [{ url: "/", label: "Home" }];

  if (isLoggedIn) {
    navItems = [
      ...navItems,
      { url: "/profile", label: "Profile" },
      { label: "My Pets" },
      { url: "/announcements", label: "Announcements" },
      { url: "/about", label: "About" },
    ];
  }

  return (
    <>
      <IconButton
        icon={<HamburgerIcon />}
        onClick={onOpen}
        size="lg"
        aria-label="Open menu"
        className="drawer-button"
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {isLoggedIn && userDetails && (
              <NavLink to="/profile">
                <Box display="flex" alignItems="center">
                  <Avatar src={userDetails.profilePhoto || ""} mr="12px">
                    {!userDetails.profilePhoto &&
                      userDetails.name &&
                      userDetails.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                  </Avatar>
                  {userDetails && <Text>Hello, {userDetails.name}</Text>}
                </Box>
              </NavLink>
            )}
          </DrawerHeader>
          <DrawerBody>
            <List spacing={4} justifyContent="center" alignItems="center">
              {navItems.map(({ url, label }) => {
                if (label === "My Pets") {
                  return (
                    <Accordion
                      allowToggle
                      onChange={() =>
                        setIsPetsAccordionExpanded(!isPetsAccordionExpanded)
                      }
                      key={label}
                    >
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex="1" textAlign="left" fontWeight="bold">
                              My Pets
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          {pets.map((pet) => (
                            <Button
                              key={pet.animalId}
                              onClick={() => handlePetClick(pet.animalId)}
                              variant="ghost"
                            >
                              {pet.animalName}
                            </Button>
                          ))}
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  );
                } else {
                  return (
                    <ListItem key={url}>
                      <Button
                        as={NavLink}
                        to={url}
                        variant="ghost"
                        width="100%"
                      >
                        {label}
                      </Button>
                    </ListItem>
                  );
                }
              })}
              <ListItem>
                <Box display="flex" justifyContent="center" width="100%">
                  <IconButton
                    aria-label={isLoggedIn ? "Logout" : "Login"}
                    icon={isLoggedIn ? <AiOutlineLogout /> : <AiOutlineLogin />}
                    onClick={handleLoginLogoutClick}
                    variant="ghost"
                  />
                </Box>
              </ListItem>
            </List>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt="20px"
            >
              <SunIcon />
              <Switch
                onChange={toggleColorMode}
                colorScheme="orange"
                mx="10px"
              />
              <MoonIcon />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NavDrawer;
