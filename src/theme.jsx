import { createTheme } from "@mui/material/styles";

const colors = {
  lightPrimary: "#1976d2",
  lightOnPrimary: "#ffffff",
  darkPrimary: "#90caf9",
  darkOnPrimary: "#000000",
  error: "#d32f2f",
  background: "#f3e5f5",
  darkBackground: "#121212",
};

export const lightTheme = createTheme({
  palette: {
    type: "light",
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
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.25rem", fontWeight: 500, lineHeight: 1.2 },
    h2: { fontSize: "2rem", fontWeight: 500, lineHeight: 1.3 },
    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          margin: "8px",
          padding: "8px 16px",
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
    type: "dark",
    primary: {
      main: "#bb86fc",
      contrastText: "#000000",
    },
    secondary: {
      main: "#03dac6",
      contrastText: "#000000",
    },
    error: {
      main: colors.error,
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a1a1a1",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.25rem", fontWeight: 500, lineHeight: 1.2 },
    h2: { fontSize: "2rem", fontWeight: 500, lineHeight: 1.3 },
    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          margin: "8px",
          padding: "8px 16px",
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
