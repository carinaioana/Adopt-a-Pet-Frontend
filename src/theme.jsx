import { extendTheme } from "@chakra-ui/react";

const transition = {
  duration: {
    normal: "0.2s",
    slow: "0.4s",
  },
  easing: {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  },
};
const space = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
};
const components = {
  Button: {
    baseStyle: {
      fontWeight: "bold",
      borderRadius: "full",
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: "md",
      },
    },
  },
};
const shadows = {
  sm: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  md: "0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)",
  lg: "0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)",
};
const radii = {
  sm: "4px",
  md: "6px",
  lg: "12px",
};
const fonts = {
  heading: '"Inter", sans-serif',
  body: '"Open Sans", sans-serif',
};

const theme = extendTheme({
  fonts,
  radii,
  shadows,
  components,
  space,
  transition,
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  styles: {
    global: (props) => (
      {
        body: {
          bg: props.colorMode === "dark" ? "gray.800" : "white",
          color: props.colorMode === "dark" ? "white" : "gray.800",
        },
      },
      {
        ":focus:not(:focus-visible)": {
          boxShadow: "none",
          outline: "none",
        },
      }
    ),
  },
});

export default theme;
