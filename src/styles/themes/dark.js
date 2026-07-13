import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import common from "./common";

const darkTheme = createTheme({
  ...common,
  palette: {
    mode: "dark",
    primary: {
      main: "#5a8f82",
      light: "#7fb0a3",
      dark: "#336c60",
    },
    danger: {
      main: red[500],
      light: red[200],
      dark: red[900],
    },
    secondary: {
      main: "#dd7a4f",
      light: "#e89c78",
      dark: "#c24e22",
    },
    active: {
      text: "#5a8f82",
      icon: "#5a8f82",
    },
    background: {
      default: "#000000",
      paper: "#222222",
      header: "#1F1F1F",
      sidebar: "#222222",
      page: "#121212",
      input: "#f8f8f8",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
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

export default darkTheme;
