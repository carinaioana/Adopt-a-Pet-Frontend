import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { NavLink, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Switch,
  Typography,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import "../styles/Header.css";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useAuth } from "./context/AuthContext.jsx";
import axios from "axios";

const StyledListItem = styled(ListItem)(({ isactive }) => ({
  "&:focus, &:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: "4px",
    outline: "none",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: "4px",
  },
  backgroundColor: isactive ? "rgba(0, 0, 0, 0.08)" : "inherit",
  borderRadius: isactive ? "4px" : "inherit",
}));

const StyledAccordion = styled(Accordion)(({ isexpanded }) => ({
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: 0,
  },
  backgroundColor: isexpanded ? "rgba(0, 0, 0, 0.08)" : "inherit",
}));
const StyledAccordionSummary = styled(AccordionSummary)(({ isexpanded }) => ({
  borderRadius: "4px",
  "&.Mui-expanded": {
    minHeight: 48,
  },
  "&:focus, &:hover": {
    backgroundColor: isexpanded ? "rgba(0, 0, 0, 0.08)" : "inherit",
  },
  "&.Mui-selected": {
    backgroundColor: isexpanded ? "rgba(0, 0, 0, 0.08)" : "inherit",
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: "12px 0",
  },
  backgroundColor: isexpanded ? "rgba(0, 0, 0, 0.08)" : "inherit",
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const NavDrawer = ({ onThemeToggle, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, authToken, userDetails } = useAuth();
  const navigate = useNavigate();
  const [isPetsAccordionExpanded, setIsPetsAccordionExpanded] = useState(false);
  const [, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  const isLoggedIn = !!authToken;
  // Modify the handleClick function to toggle the accordion's expanded state
  const handleAccordionClick = (event) => {
    setIsPetsAccordionExpanded(!isPetsAccordionExpanded);
    event.stopPropagation();
  };

  useEffect(() => {
    const fetchPetProfiles = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
        const response = await axios.get(
          "https://localhost:7141/api/v1/Animals/my-animals",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use the token for authorization
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
    // Assuming petId is an actual ID and pets is an array of pet objects
    const selectedPet = pets.find((pet) => pet.animalId === petId);
    if (selectedPet) {
      setSelectedPet(selectedPet);
      navigate(`/pet-details/${selectedPet.animalId}`, {
        state: { selectedPet: selectedPet },
      });
    } else {
      console.error("Pet not found");
    }
  };

  const toggleTheme = () => {
    onThemeToggle();
  };

  const handleDrawerToggle = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(!isOpen);
  };
  console.log(userDetails);

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate("/login"); // Navigate to login page
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
        edge="start"
        aria-label="menu"
        onClick={handleDrawerToggle}
        size="large"
        className="drawer-button"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleDrawerToggle}
        aria-label="Navigation Drawer"
        className="nav-drawer"
      >
        <Box
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          {isLoggedIn && (
            <List className="user-info">
              <ListItem component={NavLink} button to="/profile">
                <Avatar sx={{ marginRight: "1rem" }}>
                  <img src="../../public/avatar.jpg" alt="profile-photo" />
                </Avatar>
                <ListItemText
                  primary={userDetails.name}
                  className="list-item-text"
                />
              </ListItem>
            </List>
          )}
          <List className="list">
            {navItems.map(({ url, label }) => {
              if (label === "My Pets") {
                return (
                  <Box key={label}>
                    <StyledAccordion
                      onClick={handleAccordionClick}
                      expanded={isPetsAccordionExpanded}
                      onChange={handleAccordionClick}
                    >
                      <StyledAccordionSummary
                        expandIcon={<ArrowDownwardIcon />}
                        aria-controls="my-pets-menu"
                        aria-expanded={
                          isPetsAccordionExpanded ? "true" : undefined
                        }
                        isexpanded={isPetsAccordionExpanded ? 1 : 0}
                      >
                        <Typography>My Pets</Typography>
                      </StyledAccordionSummary>
                      <StyledAccordionDetails>
                        {pets.map((pet) => (
                          <Button
                            key={pet.animalId}
                            onClick={() => handlePetClick(pet.animalId)}
                          >
                            {pet.animalName}
                          </Button>
                        ))}
                      </StyledAccordionDetails>
                    </StyledAccordion>
                  </Box>
                );
              } else {
                return (
                  <StyledListItem
                    button
                    key={url}
                    component={NavLink}
                    to={url}
                    isactive={window.location.pathname === url ? 1 : 0}
                  >
                    <ListItemText primary={label} className="list-item-text" />
                  </StyledListItem>
                );
              }
            })}
          </List>
          <div className="login-logout-icon">
            <IconButton color="inherit" onClick={handleLoginLogoutClick}>
              {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
            </IconButton>
          </div>
        </Box>
        <div className="dark-mode-switch">
          <LightModeIcon />
          <Switch checked={isDarkMode} onChange={toggleTheme} color="default" />
          <DarkModeIcon />
        </div>
      </Drawer>
    </>
  );
};

NavDrawer.propTypes = {
  onThemeToggle: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default NavDrawer;
