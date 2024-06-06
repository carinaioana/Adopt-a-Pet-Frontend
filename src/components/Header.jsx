import PropTypes from "prop-types";
import NavDrawer from "./NavDrawer.jsx";
import "../styles/Header.css";
import { AppBar, Typography } from "@mui/material";

const Header = ({ onThemeToggle, isDarkMode, isLoggedIn }) => {
  const toggleTheme = () => {
    onThemeToggle();
  };

  return (
    <AppBar
      sx={{
        padding: "1rem 2rem",
        height: "fit-content",
        display: "flex",
        flexDirection: "row",
        minWidth: "100%",
        justifyContent: "space-between",
        // alignItems: "flex-start",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
        zIndex: 100,
      }}
    >
      <Typography
        variant="h4"
        className="title"
        sx={{ alignSelf: "flex-start" }}
      >
        Adopt A Pet
      </Typography>
      <NavDrawer
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
        isLoggedIn={isLoggedIn}
        sx={{ alignSelf: "flex-end" }}
      ></NavDrawer>
    </AppBar>
  );
};

Header.propTypes = {
  onThemeToggle: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default Header;
