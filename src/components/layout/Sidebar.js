"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  Hidden,
  Typography,
} from "@mui/material";
import {
  DashboardTwoTone,
  PeopleAltTwoTone,
  ProductionQuantityLimitsTwoTone,
  AccountBalanceWalletTwoTone,
  PercentTwoTone,
  StackedLineChartTwoTone,
  EngineeringTwoTone,
  LogoutTwoTone,
  ExpandMore,
  ExpandLess,
  ReceiptLongTwoTone,
  FingerprintTwoTone,
  LocalLibraryTwoTone,
  TravelExploreTwoTone,
  SecurityTwoTone,
  ForumTwoTone,
  AutoStoriesTwoTone,
  AdminPanelSettingsTwoTone,
  DescriptionTwoTone,
  Collections,
  HelpCenterTwoTone,
} from "@mui/icons-material";
import Link from "next/link";
import { Rem } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/store/authSlice";
import { setMenuBasedOnRole } from "@/store/themeSlice";
import AirlinesIcon from '@mui/icons-material/Airlines';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const iconComponents = {
  DashboardTwoTone,
  PeopleAltTwoTone,
  ProductionQuantityLimitsTwoTone,
  AccountBalanceWalletTwoTone,
  PercentTwoTone,
  StackedLineChartTwoTone,
  EngineeringTwoTone,
  AirlinesIcon ,
  LogoutTwoTone,
  ReceiptLongTwoTone,
  FingerprintTwoTone,
  LocalLibraryTwoTone,
  TravelExploreTwoTone,
  SecurityTwoTone,
  ForumTwoTone,
  AutoStoriesTwoTone,
  AdminPanelSettingsTwoTone,
  DescriptionTwoTone,
  Collections,
  HelpCenterTwoTone,
  TravelExploreIcon
};

const ListItemStyle = styled(({ isSelected, ...rest }) => (
  <ListItem {...rest} />
))(({ theme, isSelected }) => ({
  cursor: "pointer",
  color: isSelected ? theme.palette.active.text : theme.palette.text.primary,
  textShadow: isSelected ? theme.shadows[3] : "none",
  background: isSelected
    ? `linear-gradient(30deg, transparent, ${theme.palette.background.page})`
    : "transparent",
  borderRadius: `${Rem(25)} 0 0 ${Rem(25)}`,
  "&:hover": {
    color: theme.palette.active.text,
    "& .MuiSvgIcon-root": {
      color: theme.palette.active.icon,
    },
  },
  [theme.breakpoints.up("md")]: {
    "&:nth-of-type(1)": {
      marginTop: Rem(55),
    },
  },
  [theme.breakpoints.down("md")]: {
    "&:nth-of-type(1)": {
      marginTop: Rem(40),
    },
  },
  "&.MuiListItem-root": {
    cursor: "pointer",
  },
}));

const LogoutMenu = styled(({ isSelected, ...rest }) => <ListItem {...rest} />)(
  ({ theme }) => ({
    cursor: "pointer",
    color: theme.palette.text.danger,
    borderRadius: `0 ${Rem(25)} ${Rem(25)} 0`,
    "&:hover": {
      color: theme.palette.danger.dark,
      "& .MuiSvgIcon-root": {
        color: theme.palette.danger.dark,
      },
    },
    [theme.breakpoints.up("md")]: {
      "&:nth-of-type(1)": {
        marginTop: Rem(30),
      },
    },
  })
);

const NestedList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

const NestedListItem = styled(({ isSelected, ...rest }) => (
  <ListItem {...rest} />
))(({ theme, isSelected }) => ({
  paddingLeft: theme.spacing(8),
  color: isSelected ? theme.palette.active.text : "auto",
  "&:hover": {
    color: theme.palette.active.text,
    "& .MuiSvgIcon-root": {
      color: theme.palette.active.icon,
    },
  },
}));

const NestedIconStyle = styled(({ theme, isSelected, ...rest }) => (
  <ListItemIcon {...rest} />
))(({ theme, isSelected }) => ({
  minWidth: Rem(35),
  "& .MuiSvgIcon-root": {
    fontSize: Rem(20),
    color: isSelected ? theme.palette.active.icon : "auto",
  },
}));

const IconStyle = styled(({ theme, isSelected, ...rest }) => (
  <ListItemIcon {...rest} />
))(({ theme, isSelected }) => ({
  minWidth: Rem(40),
  "& .MuiSvgIcon-root": {
    color: isSelected ? theme.palette.active.icon : "auto",
  },
}));

const LogoutIconStyle = styled(({ theme, isSelected, ...rest }) => (
  <ListItemIcon {...rest} />
))(({ theme, isSelected }) => ({
  minWidth: Rem(40),
  "& .MuiSvgIcon-root": {
    color: theme.palette.text.danger,
  },
}));

const ListItemLogo = styled(({ drawerWidth, ...rest }) => (
  <ListItem {...rest} />
))(({ theme, drawerWidth }) => ({
  justifyContent: "center",
  position: "fixed",
  width: drawerWidth,
  zIndex: "999",
  marginTop: Rem(-40),
  height: Rem(74),
  backgroundColor: theme.palette.background.sidebar,
}));

export const Sidebar = ({ drawerWidth, isSidebarOpen, toggleSidebar }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = usePathname();
  const router = useRouter();
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState({
    parent: null,
    child: null,
  });
  const userInfo = useSelector((state) => state.auth.user);
  const role = userInfo?.role || "user";

  const menus = useSelector((state) => state.theme.menu);

  const toggleSubMenu = (index, isChild = false) => {
    if (isChild) {
      setSelectedIndices({
        ...selectedIndices,
        child: index,
      });
    } else {
      setOpenSubmenuIndex((prevIndex) => (prevIndex === index ? null : index));
      setSelectedIndices({
        ...selectedIndices,
        parent: index,
      });
    }
    if (toggleSidebar) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    const selectedParentIndex =
      menus?.length &&
      menus
        .filter((item) => item.show)
        .findIndex((item) => item.url === `/${location.split("/")[1]}`);

    if (selectedParentIndex !== -1) {
      const selectedChildIndex =
        menus?.length &&
        menus
          .filter((item) => item.show)
          [selectedParentIndex].children.findIndex(
            (item) => item.url === `/${location.split("/")[2]}`
          );
      setOpenSubmenuIndex(selectedParentIndex);

      setSelectedIndices({
        parent: selectedParentIndex,
        child: selectedChildIndex !== -1 ? selectedChildIndex : null,
      });
    }
  }, [menus, location]);

  useEffect(() => {
    dispatch(setMenuBasedOnRole(role));
  }, [dispatch, role]);

  return (
    <List>
      {isSidebarOpen && (
        <Hidden mdDown>
          <ListItemLogo drawerWidth={drawerWidth}>
            <img src={theme.logoUrl} width={150} alt="Admin" />
          </ListItemLogo>
        </Hidden>
      )}
      {menus?.length &&
        menus
          .filter((item) => item.show)
          .map((item, index) => (
            <React.Fragment key={index}>
              {item.children.length ? (
                <>
                  <ListItemStyle
                    onClick={() =>
                      setOpenSubmenuIndex((prevIndex) =>
                        prevIndex === index ? null : index
                      )
                    }
                    isSelected={selectedIndices.parent === index}
                  >
                    <IconStyle isSelected={selectedIndices.parent === index}>
                      {item.icon &&
                        React.createElement(iconComponents[item.icon])}
                    </IconStyle>
                    <ListItemText primary={item.name} />
                    {openSubmenuIndex === index ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemStyle>
                  <Collapse in={openSubmenuIndex === index}>
                    <NestedList component="div" disablePadding>
                      {item.children.map((cItem, cIndex) => (
                        <NestedListItem
                          key={cIndex}
                          component={Link}
                          href={item.url + cItem.url}
                          onClick={() => toggleSubMenu(cIndex, true)}
                          isSelected={selectedIndices.child === cIndex}
                        >
                          <NestedIconStyle
                            isSelected={selectedIndices.child === cIndex}
                          >
                            {cItem.icon &&
                              React.createElement(iconComponents[cItem.icon])}
                          </NestedIconStyle>
                          <ListItemText primary={cItem.name} />
                        </NestedListItem>
                      ))}
                    </NestedList>
                  </Collapse>
                </>
              ) : (
                <ListItemStyle
                  key={index}
                  component={Link}
                  href={item.url}
                  className={`${
                    location.toLowerCase() == item.url.toLowerCase()
                      ? "activeLinkTab"
                      : ""
                  } normalLinkTab`}
                  onClick={() => toggleSubMenu(index)}
                  isSelected={selectedIndices.parent === index}
                >
                  <IconStyle isSelected={selectedIndices.parent === index}>
                    {item.icon &&
                      React.createElement(iconComponents[item.icon])}
                  </IconStyle>
                  <ListItemText primary={item.name} />
                </ListItemStyle>
              )}
            </React.Fragment>
          ))}
      
    </List>
  );
};
