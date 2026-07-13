import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

const isInteger = (value) => /^\d+$/.test(value);
const isDecimal = (value) => /^\d+(\.\d+)?$/.test(value);
const isAlphabet = (value) => /^[A-Za-z]+$/.test(value);
const isAlphabetWithSpace = (value) => /^[A-Za-z\s]+$/.test(value);

export const HInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  helperText,
  fullWidth = true,
  margin = "none",
  required = false,
  multiline = false,
  rows = 1,
  variant = "outlined",
  ...otherProps
}) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;

    switch (type) {
      case "integer":
        if (inputValue !== "" && !isInteger(inputValue)) {
          return;
        }
        break;
      case "decimal":
        if (inputValue !== "" && !isDecimal(inputValue)) {
          return;
        }
        break;
      case "alphabet":
        if (inputValue !== "" && !isAlphabet(inputValue)) {
          return;
        }
        break;
      case "alphabetwithspace":
        if (inputValue !== "" && !isAlphabetWithSpace(inputValue)) {
          return;
        }
        break;
      default:
        break;
    }

    onChange(e);
  };

  return (
    <TextField
      label={label}
      name={name}
      type={type === "integer" || type === "decimal" ? "text" : type}
      value={value}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      margin={margin}
      required={required}
      multiline={multiline}
      rows={rows}
      variant={variant}
      {...otherProps}
    />
  );
};

HInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.oneOf([
    "text",
    "integer",
    "decimal",
    "alphabet",
    "alphabetwithspace",
    "email",
    "password",
  ]),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool,
  margin: PropTypes.oneOf(["none", "dense", "normal"]),
  required: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  variant: PropTypes.oneOf(["filled", "outlined", "standard"]),
};
