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
  Divider,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { PermIdentity } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Rem } from "@/utils";
import { HButton } from "./HButton";
import { logoutUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

const StyledCard = styled(Card)({
  minWidth: Rem(300),
});

const StyledAvatar = styled(Avatar)({
  width: Rem(120),
  height: Rem(120),
});

const StyledList = styled(List)({
  width: "100%",
  minWidth: Rem(300),
  padding: 0,
});

const StyledListItem = styled(ListItem)({
  padding: 0,
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

const BalanceContainer = styled("span")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const PhoneNumberContainer = styled("span")({
  marginBottom: Rem(20),
});

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const ProfileMenu = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const userInfo = useSelector((state) => state.auth.user);

  const logOutFromApp = async () => {
    await dispatch(logoutUser()).unwrap();
    router.push("/login");
  };

  return (
    <StyledCard>
      <CardContent>
        <StyledList>
          <StyledListItem>
            <ListItemAvatar>
              <StyledAvatar
                alt="Remy Sharp"
                src="/img/avatar1.png"
                sx={{
                  width: 50,
                  height: 50,
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="h6" component={"span"} fontWeight="bold">
                  {userInfo?.name}{" "}
                  <Typography
                    variant="small"
                    style={{ fontSize: 12 }}
                    component={"span"}
                  >
                    ({userInfo?.role})
                  </Typography>
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <PhoneNumberContainer>
                    <Typography
                      variant="body2"
                      component={"span"}
                      color="text.secondary"
                    >
                      {userInfo?.phone}
                    </Typography>
                  </PhoneNumberContainer>
                  <BalanceContainer>
                    <Typography
                      variant="body2"
                      component={"span"}
                      color="text.secondary"
                    >
                      {userInfo?.email}
                    </Typography>
                  </BalanceContainer>
                </React.Fragment>
              }
            />
          </StyledListItem>
        </StyledList>
        <StyledDivider />
        <List sx={{ width: "100%", maxWidth: Rem(360) }}>
          <ListItemMenu onClick={() => router.push("/profile")}>
            <ListItemAvatar>
              <Avatar style={{ background: theme.palette.background.page }}>
                <PermIdentity color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="My Profile" secondary="Account Settings" />
          </ListItemMenu>
        </List>
        <HButton
          shape={"round"}
          variant="outlined"
          style={{ color: theme.palette.text.danger, marginTop: Rem(15) }}
          onClick={logOutFromApp}
          fullWidth
        >
          Logout
        </HButton>
      </CardContent>
    </StyledCard>
  );
};
