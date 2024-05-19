import PropTypes from "prop-types";
import NavDrawer from "./NavDrawer.jsx";
import "../styles/Header.css";
import { Typography } from "@mui/material";

const Header = ({ onThemeToggle, isDarkMode, isLoggedIn }) => {
  const toggleTheme = () => {
    onThemeToggle();
  };

  return (
    <header>
      <Typography variant="h4" className="title">
        Adopt A Friend
      </Typography>
      <NavDrawer
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
        isLoggedIn={isLoggedIn}
      ></NavDrawer>
    </header>
  );
};

Header.propTypes = {
  onThemeToggle: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default Header;
