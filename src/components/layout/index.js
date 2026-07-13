import { useState } from "react";
import { styled } from "@mui/material/styles";
import { IconButton, Drawer, Hidden } from "@mui/material";
import { Close } from "@mui/icons-material";
import { MainContent } from "./MainContent";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const drawerWidth = 230;

const LayoutWrapper = styled("div")(() => ({
  display: "flex",
  overflow: "hidden",
}));

const IconButtonWrapper = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const DrawerWrapper = styled(Drawer)(({ theme, width }) => ({
  [theme.breakpoints.up("md")]: {
    width: width,
  },
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  "&.MuiDrawer-root > .MuiPaper-root": {
    border: "none",
    background: theme.palette.background.sidebar,
  },
}));

const DrawerPaperWrapper = styled("div")(({ theme, isSidebarOpen }) => ({
  width: isSidebarOpen ? drawerWidth : 0,
  paddingTop: theme.spacing(6),
  [theme.breakpoints.up("md")]: {
    width: isSidebarOpen ? drawerWidth : 0,
  },
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflow: "hidden",
  // overflowY: "scroll",
  // scrollbarWidth: "thin",
  // "&::-webkit-scrollbar": {
  //   width: "0.5em",
  // },
  // "&::-webkit-scrollbar-thumb": {
  //   backgroundColor: "transparent",
  // },
}));

const ContentWrapper = styled("main")(({ theme, isSidebarOpen }) => ({
  flex: 1,
  marginLeft: isSidebarOpen ? drawerWidth : 0,
  overflow: "hidden",
  [theme.breakpoints.up("md")]: {
    width: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)`,
  },
  transition: theme.transitions.create(["margin-left", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

export const Layout = ({ children, title }) => {
  // useAuth() ;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <LayoutWrapper>
      <Hidden mdUp>
        {" "}
        <DrawerWrapper
          variant="temporary"
          anchor="left"
          width={isSidebarOpen ? drawerWidth : 0}
          open={isSidebarOpen}
        >
          <DrawerPaperWrapper isSidebarOpen={isSidebarOpen}>
            <IconButtonWrapper
              edge="end"
              color="inherit"
              aria-label="close"
              onClick={toggleSidebar}
              sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
            >
              <Close />
            </IconButtonWrapper>
            <Sidebar
              drawerWidth={drawerWidth}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          </DrawerPaperWrapper>
        </DrawerWrapper>
      </Hidden>
      <Hidden mdDown>
        {" "}
        <DrawerWrapper
          variant="permanent"
          anchor="left"
          width={isSidebarOpen ? drawerWidth : 0}
          open={isSidebarOpen}
        >
          <DrawerPaperWrapper isSidebarOpen={isSidebarOpen}>
            <Sidebar drawerWidth={drawerWidth} isSidebarOpen={isSidebarOpen} />
          </DrawerPaperWrapper>
        </DrawerWrapper>
      </Hidden>
      <ContentWrapper>
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          drawerWidth={drawerWidth}
        />

        <MainContent title={title} sx={{ color: "#f35315" }}>
          {children}
        </MainContent>
      </ContentWrapper>
    </LayoutWrapper>
  );
};
