import React from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "@/store/settingsSlice";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Toast = ({
  toast = {
    open: false,
    message: "",
    type: "info",
    timeOut: 5000,
  },
}) => {
  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.settings.toast || toast);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideToast());
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        open={toastState.open}
        autoHideDuration={toastState.timeOut}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={toastState.type}
          sx={{ width: "100%" }}
        >
          {toastState.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

Toast.propTypes = {
  toast: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    message: PropTypes.string,
    type: PropTypes.oneOf(["info", "success", "warning", "error"]),
    timeOut: PropTypes.number,
  }),
};
