import { createTheme } from "@mui/material/styles";

const common = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  spacing: 4,
  shape: {
    borderRadius: 4,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  overrides: {},
});

common.typography = {
  ...common.typography,
  [common.breakpoints.up("sm")]: {
    h1: {
      fontSize: "2.5rem",
    },
  },
  [common.breakpoints.up("md")]: {
    h1: {
      fontSize: "3rem",
    },
  },
};

export default common;
