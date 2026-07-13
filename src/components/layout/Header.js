"use client";

import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Hidden,
  useTheme,
  Popover,
  Badge,
} from "@mui/material";
import {
  Menu,
  Notifications,
  MenuOpenTwoTone,
  DarkModeTwoTone,
  FlareTwoTone,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Rem } from "@/utils";
import { NotificationMenu, ProfileMenu } from "../UI";
import { toggleTheme } from "@/store/themeSlice";
import { loggedInUser } from "@/store/authSlice";


const AppBarWrapper = styled("div")(
  ({ theme, isSidebarOpen, drawerWidth, isScrolled }) => ({
    zIndex: 100,
    background: isScrolled ? theme.palette.background.header : "transparent",
    boxShadow: isScrolled ? theme.shadows[1] : "none",
    padding: 0,
    position: "fixed",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)`,
    },
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  })
);

const ToolbarWrapper = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

const IconButtonWrapper = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  background: "transparent",
}));

const ThemeModeIcon = styled("span")(({ theme }) => ({
  cursor: "pointer",
  padding: Rem(10),
  color: theme.palette.primary.main,
}));

const ImageContainer = styled(Box)(() => ({
  display: "flex",
  position: "absolute",
  marginLeft: Rem(20),
}));

const ImageLogo = styled("img")(({ theme }) => ({
  marginLeft: Rem(-30),
  width: Rem(140),
  [theme.breakpoints.down("sm")]: {
    width: Rem(110),
  },
}));

const ProfileMenuContainer = styled(Popover)(({ theme }) => ({
  "& .MuiPaper-root": {
    boxShadow: theme.shadows[2],
    marginTop: Rem(-5),
  },
}));

export const Header = ({ toggleSidebar, isSidebarOpen, drawerWidth }) => {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const theme = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuEl, setProfileMenuEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);

  const toggleAppTheme = () => {
    dispatch(toggleTheme(!isDarkMode));
  };

  const handleAvatarClick = (event) => {
    setProfileMenuEl(event.currentTarget);
  };

  const handleCloseMenuPopover = () => {
    setProfileMenuEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationEl(event.currentTarget);
  };

  const handleCloseNotificationPopover = () => {
    setNotificationEl(null);
  };

  useEffect(() => {
    const mainPageContainer = document.getElementById("main-page-contaner");
    const handleScroll = () => {
      const scrollPosition = mainPageContainer.scrollTop;
      if (scrollPosition > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (mainPageContainer) {
      mainPageContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (mainPageContainer) {
        mainPageContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (!user) {
      dispatch(loggedInUser());
    }
  }, [user]);

  return (
    <AppBarWrapper
      position="fixed"
      isSidebarOpen={isSidebarOpen}
      drawerWidth={drawerWidth}
      isScrolled={isScrolled}
    >
      <ToolbarWrapper>
        <IconButtonWrapper
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <MenuOpenTwoTone /> : <Menu />}
        </IconButtonWrapper>
        <Hidden mdUp>
          <ImageContainer>
            <ImageLogo src={theme.logoUrl} alt="Admin" />
          </ImageContainer>
        </Hidden>
        <Box>
          <IconButton color="inherit" onClick={handleAvatarClick}>
            <Avatar
              alt="Avatar"
              src="/img/avatar1.png"
              sx={{ width: Rem(50), height: Rem(50) }}
            />
          </IconButton>
          <ProfileMenuContainer
            open={Boolean(profileMenuEl)}
            anchorEl={profileMenuEl}
            onClose={handleCloseMenuPopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <ProfileMenu />
          </ProfileMenuContainer>
          <ProfileMenuContainer
            open={Boolean(notificationEl)}
            anchorEl={notificationEl}
            onClose={handleCloseNotificationPopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <NotificationMenu />
          </ProfileMenuContainer>
        </Box>
      </ToolbarWrapper>
    </AppBarWrapper>
  );
};
