import PropTypes from "prop-types";
import { Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Rem } from "@/utils";

const StyledButton = styled(MuiButton)(({ theme, shape }) => ({
  borderRadius: shape === "round" ? Rem(100) : Rem(5),
  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
}));

export const HButton = ({ children, shape, size, ...rest }) => {
  const buttonSize =
    size === "small" ? "small" : size === "large" ? "large" : "medium";

  return (
    <StyledButton variant="contained" size={buttonSize} shape={shape} {...rest}>
      {children}
    </StyledButton>
  );
};

HButton.propTypes = {
  children: PropTypes.node.isRequired,
  shape: PropTypes.oneOf(["round", "square"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

HButton.defaultProps = {
  shape: "square",
  size: "medium",
};
