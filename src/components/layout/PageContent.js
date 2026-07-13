import { Rem } from "@/utils";
import { Box, Typography, styled } from "@mui/material";
import "@/styles/updated.css";

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(12),
  height: "91vh",
  overflowY: "auto",
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    width: Rem(5),
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgb(99 124 124)",
    borderRadius: 5,
  },
  scrollbarWidth: "thin",
  scrollbarColor: `rgb(99 124 124) transparent`,
  [theme.breakpoints.down("md")]: {
    "&::-webkit-scrollbar": {
      width: 0,
    },
    padding: 0,
  },
}));

const Content = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

export const PageContent = ({ children, title }) => {
  return (
    <PageContainer
      id="main-page-contaner"
      // className="main-page-contaner-main-theme"
    >
      <Typography
        variant="h4"
        component="h4"
        color={"primary"}
        // sx={{ color: "#336f61" }}
      >
        {title}
      </Typography>
      <Content>{children}</Content>
    </PageContainer>
  );
};
