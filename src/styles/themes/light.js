import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import common from "./common";

const lightTheme = createTheme({
  ...common,
  palette: {
    mode: "light",
    primary: {
      main: "#1E90D2",
      light: "#4FB4E6",
      dark: "#1565A0",
    },
    danger: {
      main: red[500],
      light: red[200],
      dark: red[900],
    },
    secondary: {
      main: "#F7941D",
      light: "#FDB913",
      dark: "#E0700F",
    },
    active: {
      text: "#1E90D2",
      icon: "#1E90D2",
    },
    background: {
      default: "#0000",
      paper: "#FFFFFF",
      header: "#FFFFFF",
      sidebar: "#FFFFFF",
      page: "#e8f3fa",
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
