'use client'
import { useState } from 'react';
import { 
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Container,
  CssBaseline,
  Avatar,
  Link,
  Grid
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockResetIcon from '@mui/icons-material/LockReset';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

const defaultTheme = createTheme();

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState({ text: '', severity: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '' });
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    let valid = true;
    const newErrors = { email: '' };
    
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    setErrors(newErrors);
    if (!valid) return;

    setLoading(true);
    setMsg({ text: '', severity: '' });

    try {
      const res = await fetch("/api/auth/request-reset-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ text: "Password reset link sent! Please check your email.", severity: 'success' });
      } else {
        setMsg({ text: data.message || "Something went wrong. Please try again.", severity: 'error' });
      }
    } catch (error) {
      setMsg({ text: "Network error. Please try again.", severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockResetIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Paper elevation={3} sx={{ mt: 3, p: 3, width: '100%' }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
              
              {msg.text && (
                <Alert severity={msg.severity} sx={{ mt: 2 }}>
                  {msg.text}
                </Alert>
              )}
              
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link 
                    href="/login" 
                    variant="body2"
                    sx={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/login');
                    }}
                  >
                    Remember your password? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}