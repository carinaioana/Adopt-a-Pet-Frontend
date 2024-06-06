import { createTheme } from "@mui/material/styles";

const colors = {
  lightPrimary: "#ff6f61",
  lightOnPrimary: "#ffffff",
  darkPrimary: "#8e24aa",
  darkOnPrimary: "#ffffff",
  error: "#e57373",
  background: "#fff3e0",
  darkBackground: "#311b92",
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.lightPrimary,
      contrastText: colors.lightOnPrimary,
    },
    error: {
      main: colors.error,
    },
    background: {
      default: colors.background,
    },
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
    h1: { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.3 },
    body1: { fontSize: "1.1rem", fontWeight: 400, lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1.1rem",
          margin: "10px",
          padding: "10px 20px",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        margin: "normal",
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#077187", // Cerulean
      contrastText: "#fffaff", // Ghost White
    },
    secondary: {
      main: "#82204a", // Murrey
      contrastText: "#fffaff", // Ghost White
    },
    error: {
      main: "#772d8b", // Eminence
    },
    background: {
      default: "#0a0903", // Smoky Black
      paper: "#0a0903", // Smoky Black
    },
    text: {
      primary: "#fffaff", // Ghost White
      secondary: "#b0b0b0", // Medium grey
    },
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
    h1: { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.3 },
    body1: { fontSize: "1.1rem", fontWeight: 400, lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1.1rem",
          margin: "10px",
          padding: "10px 20px",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        margin: "normal",
      },
    },
  },
});
