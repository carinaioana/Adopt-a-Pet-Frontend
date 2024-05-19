/*
import { createTheme } from "@mui/material/styles";

// Extracted colors from the provided JSON for the light theme
const themeColors = {
  primary: "#755086",
  onPrimary: "#FFFFFF",
  primaryContainer: "#F6D9FF",
  onPrimaryContainer: "#2D0B3E",
  secondary: "#68596D",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#F0DCF4",
  onSecondaryContainer: "#231728",
  tertiary: "#815251",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FFDAD9",
  onTertiaryContainer: "#331112",
  error: "#BA1A1A",
  onError: "#FFFFFF",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#410002",
  background: "#FFF7FC",
  onBackground: "#1E1A1F",
  surface: "#FFF7FC",
  onSurface: "#1E1A1F",
  surfaceVariant: "#EBDFEA",
  onSurfaceVariant: "#4C444D",
  outline: "#7D747E",
  shadow: "#000000",
  inverseSurface: "#342F34",
  inverseOnSurface: "#F8EEF6",
  inversePrimary: "#E3B7F4",
};

// Creating the theme with the extracted colors
const lightTheme = createTheme({
  palette: {
    primary: {
      main: themeColors.primary,
      contrastText: themeColors.onPrimary,
    },
    secondary: {
      main: themeColors.secondary,
      contrastText: themeColors.onSecondary,
    },
    error: {
      main: themeColors.error,
      contrastText: themeColors.onError,
    },
    background: {
      default: themeColors.background,
      paper: themeColors.surface,
    },
    text: {
      primary: themeColors.onBackground,
      secondary: themeColors.onSurface,
    },
  },
  components: {
    // You can add component overrides here
  },
});

// Creating the dark theme with the extracted colors
const darkTheme = createTheme({
  palette: {
    primary: {
      main: themeColors.primary,
      contrastText: themeColors.onPrimary,
    },
    secondary: {
      main: themeColors.secondary,
      contrastText: themeColors.onSecondary,
    },
    error: {
      main: themeColors.error,
      contrastText: themeColors.onError,
    },
    background: {
      default: themeColors.inverseSurface,
      paper: themeColors.surfaceVariant,
    },
    text: {
      primary: themeColors.inverseOnSurface,
      secondary: themeColors.onSurfaceVariant,
    },
  },
  components: {
    // You can add component overrides here for the dark theme
  },
});

export { lightTheme, darkTheme };
*/
/*
import { createTheme } from "@mui/material/styles";

// Base colors
const colors = {
  federalBlue: "#07004D",
  steelBlue: "#2D82B7",
  aquamarine: "#42E2B8",
  dutchWhite: "#F3DFBF",
  lightCoral: "#EB8A90",
};

// Light theme
export const lightTheme = createTheme({
  palette: {
    primary: {
      main: colors.steelBlue,
      contrastText: colors.dutchWhite,
    },
    secondary: {
      main: colors.aquamarine,
      contrastText: colors.federalBlue,
    },
    error: {
      main: colors.lightCoral,
      contrastText: colors.dutchWhite,
    },
    background: {
      default: colors.dutchWhite,
      paper: "#FFFFFF",
    },
    text: {
      primary: colors.federalBlue,
      secondary: colors.steelBlue,
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  palette: {
    primary: {
      main: colors.aquamarine,
      contrastText: colors.federalBlue,
    },
    secondary: {
      main: colors.lightCoral,
      contrastText: colors.dutchWhite,
    },
    error: {
      main: colors.lightCoral,
      contrastText: colors.federalBlue,
    },
    background: {
      default: colors.federalBlue,
      paper: colors.steelBlue,
    },
    text: {
      primary: colors.dutchWhite,
      secondary: colors.aquamarine,
    },
  },
});
*/
import { createTheme } from "@mui/material/styles";

// Adjusted base colors for better contrast
const colors = {
  mintGreen: "#DDFFF7",
  tiffanyBlue: "#93E1D8",
  melon: "#FFA69E",
  raspberryRose: "#AA4465",
  russianViolet: "#462255",
  deepSapphire: "#005DAA",
  ivory: "#FFFFF0",
  deepOcean: "#0D1B2A", // A deep, dark blue reminiscent of the ocean at night
  twilightCrimson: "#7B0828", // A deep crimson for highlighting critical elements
  moonlightSilver: "#757575", // A muted silver for secondary text and icons
  starlightWhite: "#E0E1DD", // A soft white for primary text, ensuring readability
  nebulaPink: "#FF77E9", // A vibrant pink for accent elements, adding a pop of color
  galaxyBlue: "#1B3B6F", // A rich blue for secondary elements and backgrounds
  cometTail: "#8ab5d6",
};

// Light theme with adjusted contrasts
export const lightTheme = createTheme({
  palette: {
    primary: {
      main: colors.tiffanyBlue,
      contrastText: colors.ivory,
    },
    secondary: {
      main: colors.melon,
      contrastText: colors.deepSapphire,
    },
    error: {
      main: colors.raspberryRose,
      contrastText: colors.ivory,
    },
    background: {
      default: colors.ivory,
      paper: colors.mintGreen,
    },
    text: {
      primary: colors.russianViolet,
      secondary: colors.deepSapphire,
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: colors.galaxyBlue,
      contrastText: colors.starlightWhite,
    },
    secondary: {
      main: colors.nebulaPink,
      contrastText: colors.deepOcean,
    },
    error: {
      main: colors.twilightCrimson,
      contrastText: colors.starlightWhite,
    },
    background: {
      default: colors.deepOcean,
      paper: colors.cometTail,
    },
    text: {
      primary: colors.starlightWhite,
      secondary: colors.moonlightSilver,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Ensuring buttons have enough contrast and are visually appealing
          color: colors.starlightWhite,
          "&:hover": {
            backgroundColor: colors.twilightCrimson,
          },
        },
      },
    },
  },
});
