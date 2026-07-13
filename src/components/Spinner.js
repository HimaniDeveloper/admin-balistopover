import { useTheme } from "@mui/material";
import { RingLoader } from "react-spinners";

export const Spinner = () => {
  const theme = useTheme();
  return (
    <div className="sweet-loading">
      <RingLoader
        size={theme.breakpoints.down("sm") ? 80 : 130}
        color={theme.palette.primary.main}
        loading={true}
      />
    </div>
  );
};
