import { useState } from "react";
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
import { useAuth } from "./Authentication/context/AuthContext.jsx";

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

const StyledAccordion = styled(Accordion)(({ theme, isexpanded }) => ({
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: 0,
  },
  backgroundColor: isexpanded ? "rgba(0, 0, 0, 0.08)" : "inherit",
}));

const StyledAccordionSummary = styled(AccordionSummary)(
  ({ theme, isexpanded }) => ({
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
  }),
);

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const NavDrawer = ({ onThemeToggle, isDarkMode, isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [isPetsAccordionExpanded, setIsPetsAccordionExpanded] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  // Modify the handleClick function to toggle the accordion's expanded state
  const handleAccordionClick = (event) => {
    setIsPetsAccordionExpanded(!isPetsAccordionExpanded);
    event.stopPropagation();
  };

  const pets = {
    pet1: {
      name: "Buddy",
      species: "Dog",
      age: 2,
      vaccines: [
        { name: "Rabies", date: "2021-05-12", nextDue: "2023-05-12" },
        { name: "Distemper", date: "2021-06-01", nextDue: "2023-06-01" },
      ],
      dewormingStatus: [
        { date: "2022-01-15", nextDue: "2022-07-15" },
        { date: "2022-07-15", nextDue: "2023-01-15" },
      ],
      observations:
        "Buddy is energetic and loves to play fetch. No known allergies.",
    },
    pet2: {
      name: "Max",
      species: "Dog",
      age: 1,
      vaccines: [
        { name: "Rabies", date: "2022-03-20", nextDue: "2024-03-20" },
        { name: "Parvovirus", date: "2022-04-10", nextDue: "2024-04-10" },
      ],
      dewormingStatus: [
        { date: "2022-02-10", nextDue: "2022-08-10" },
        { date: "2022-08-10", nextDue: "2023-02-10" },
      ],
      observations:
        "Max is a bit shy around new people but warms up quickly. Sensitive to chicken-based foods.",
    },
    pet3: {
      name: "Bella",
      species: "Cat",
      age: 3,
      vaccines: [
        {
          name: "Feline Leukemia Virus",
          date: "2021-04-25",
          nextDue: "2023-04-25",
        },
        { name: "Rabies", date: "2021-05-10", nextDue: "2023-05-10" },
      ],
      dewormingStatus: [
        { date: "2022-03-05", nextDue: "2022-09-05" },
        { date: "2022-09-05", nextDue: "2023-03-05" },
      ],
      observations:
        "Bella loves to climb and explore high places. Ensure windows are secure.",
    },
  };

  // Existing code...

  const handlePetClick = (petId) => {
    console.log(`Pet clicked: ${pets[petId].name}`);
    setSelectedPet(pets[petId]); // Set the selected pet's details
    navigate(`/pet-details/${petId}`);
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

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate("/login"); // Navigate to login page
    }
  };

  let navItems = [
    { url: "/", label: "Home" },

  ];

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
        <div
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          {isLoggedIn && (
            <List className="user-info">
              <ListItem component={NavLink} button to="/profile">
                <Avatar sx={{marginRight: "1rem"}}>
                  <img src="../../public/avatar.jpg" alt="profile-photo" />
                </Avatar>
                <ListItemText primary="User" className="list-item-text" />
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
                        {Object.keys(pets).map((petId) => (
                          <Button
                            key={petId}
                            onClick={() => handlePetClick(petId)}
                          >
                            {pets[petId].name}
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
                    key={url} // This already has a unique key, which is good
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
        </div>
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
  isLoggedIn: PropTypes.bool.isRequired,
};

export default NavDrawer;
