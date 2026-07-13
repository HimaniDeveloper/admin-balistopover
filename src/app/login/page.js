"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Link,
  Avatar,
} from "@mui/material";
import { loginUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import "@/styles/updated.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ username, password })).unwrap();
      if (result && result.success) {
        window.location.href = "/";
      } else {
        console.error("Login failed: Invalid response");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{ marginTop: "50px" }}
      className="loginBgBack"
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={10}>
          <Paper
            elevation={3}
            style={{ padding: "30px", borderRadius: "12px" }}
          >
            <img
              src="./logo.webp"
              alt="main-logo"
              style={{
                width: "200px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "10px",
              }}
            />

            <Box textAlign="center" mb={4}>
              <Typography
                className="Login_Heading"
                variant="h4"
                color="primary"
                gutterBottom
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                className="Login_text"
              >
                Sign in to continue to your account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  style: { borderRadius: "12px" },
                }}
              />

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  style: { borderRadius: "12px" },
                }}
              />

              {error && (
                <Box my={2}>
                  <Typography color="error" align="center">
                    {error}
                  </Typography>
                </Box>
              )}

              <Box mt={3} mb={2}>
                <Button
                  type="submit"
                  variant="contained"
                  // color="primary"
                  disabled={loading}
                  fullWidth
                  size="large"
                  style={{
                    borderRadius: "12px",
                    padding: "10px",
                    fontSize: "20px",
                    fontWeight: "500",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  className="LoginButton"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
