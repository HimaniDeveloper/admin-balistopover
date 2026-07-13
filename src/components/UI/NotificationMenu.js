import React from "react";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import { Rem } from "@/utils";
import { HButton } from "./HButton";

const StyledCard = styled(Card)({
  minWidth: Rem(300),
});

const StyledAvatar = styled(Avatar)({
  width: Rem(50),
  height: Rem(50),
});

const ListItemMenu = styled(ListItem)(({ theme }) => ({
  cursor: "pointer",
  paddingTop: Rem(2),
  paddingBottom: Rem(3),
  borderRadius: Rem(10),
  "&:hover": {
    background: theme.palette.background.page,
  },
}));

const HeadingContainer = styled("span")({
  display: "flex",
  justifyContent: "space-between",
  flex: 1,
});

export const NotificationMenu = () => {
  return (
    <StyledCard>
      <CardContent>
        <HeadingContainer>
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <Chip label="5 New" color="secondary" />
          </Box>
        </HeadingContainer>
        <List sx={{ width: "100%", maxWidth: Rem(360) }}>
          <ListItemMenu>
            <ListItemAvatar>
              <StyledAvatar alt="Remy Sharp" src="img/avatar1.png" />
            </ListItemAvatar>
            <ListItemText
              primary="My Notification!"
              secondary="Account Settings testing..."
            />
          </ListItemMenu>
          <ListItemMenu>
            <ListItemAvatar>
              <StyledAvatar alt="Remy Sharp" src="img/avatar1.png" />
            </ListItemAvatar>
            <ListItemText
              primary="My Notification!"
              secondary="Account Settings testing..."
            />
          </ListItemMenu>
          <ListItemMenu>
            <ListItemAvatar>
              <StyledAvatar alt="Remy Sharp" src="img/avatar1.png" />
            </ListItemAvatar>
            <ListItemText
              primary="My Notification!"
              secondary="Account Settings testing..."
            />
          </ListItemMenu>
          <ListItemMenu>
            <ListItemAvatar>
              <StyledAvatar alt="Remy Sharp" src="img/avatar1.png" />
            </ListItemAvatar>
            <ListItemText
              primary="My Notification!"
              secondary="Account Settings testing..."
            />
          </ListItemMenu>
          <ListItemMenu>
            <ListItemAvatar>
              <StyledAvatar alt="Remy Sharp" src="img/avatar1.png" />
            </ListItemAvatar>
            <ListItemText
              primary="My Notification!"
              secondary="Account Settings testing..."
            />
          </ListItemMenu>
        </List>
        <HButton size={"small"} fullWidth>
          See all Notifications
        </HButton>
      </CardContent>
    </StyledCard>
  );
};
