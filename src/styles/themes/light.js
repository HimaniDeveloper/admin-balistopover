import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import common from "./common";

const lightTheme = createTheme({
  ...common,
  palette: {
    mode: "light",
    primary: {
      main: "#336c60",
      light: "#5a8f82",
      dark: "#244d44",
    },
    danger: {
      main: red[500],
      light: red[200],
      dark: red[900],
    },
    secondary: {
      main: "#c24e22",
      light: "#dd7a4f",
      dark: "#933716",
    },
    active: {
      text: "#336c60",
      icon: "#336c60",
    },
    background: {
      default: "#0000",
      paper: "#FFFFFF",
      header: "#FFFFFF",
      sidebar: "#FFFFFF",
      page: "#e2eded",
      input: "#f8f8f8",
    },
    text: {
      primary: "#333333",
      secondary: "#757575",
      danger: red[500],
    },
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 0, 0, 0.1)",
    "0px 4px 6px rgba(0, 0, 0, 0.2), 0px 2px 4px rgba(0, 0, 0, 0.1)",
    "0px 6px 9px rgba(0, 0, 0, 0.3), 0px 3px 5px rgba(0, 0, 0, 0.2)",
    "0px 8px 12px rgba(0, 0, 0, 0.4), 0px 4px 6px rgba(0, 0, 0, 0.3)",
    "0px 12px 18px rgba(0, 0, 0, 0.5), 0px 6px 9px rgba(0, 0, 0, 0.4)",
    "0px 16px 24px rgba(0, 0, 0, 0.6), 0px 8px 12px rgba(0, 0, 0, 0.5)",
    "0px 24px 36px rgba(0, 0, 0, 0.7), 0px 12px 18px rgba(0, 0, 0, 0.6)",
    "0px 32px 48px rgba(0, 0, 0, 0.8), 0px 16px 24px rgba(0, 0, 0, 0.7)",
    ...common.shadows,
  ],
  logoUrl: "/logo.webp",
});

export default lightTheme;
