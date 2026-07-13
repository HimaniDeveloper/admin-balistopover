'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import VpnKeyIcon from '@mui/icons-material/VpnKey'

const defaultTheme = createTheme()

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState({ text: '', severity: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ 
    newPassword: '',
    confirmPassword: '' 
  })

  const validatePassword = (password) => {
    return password.length >= 8
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate inputs
    let valid = true
    const newErrors = { 
      newPassword: '',
      confirmPassword: '' 
    }
    
    if (!newPassword) {
      newErrors.newPassword = 'Password is required'
      valid = false
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters'
      valid = false
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      valid = false
    }
    
    setErrors(newErrors)
    if (!valid) return

    setLoading(true)
    setMessage({ text: '', severity: '' })

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()
      if (res.ok) {
        setMessage({ 
          text: 'Password reset successfully! Redirecting to login...', 
          severity: 'success' 
        })
        setTimeout(() => router.push('/login'), 3000)
      } else {
        setMessage({ 
          text: data?.message || 'Something went wrong. Please try again.', 
          severity: 'error' 
        })
      }
    } catch (error) {
      setMessage({ 
        text: 'Network error. Please try again.', 
        severity: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <VpnKeyIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Paper elevation={3} sx={{ mt: 3, p: 3, width: '100%' }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
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
                  'Reset Password'
                )}
              </Button>
              
              {message.text && (
                <Alert severity={message.severity} sx={{ mt: 2 }}>
                  {message.text}
                </Alert>
              )}
              
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link 
                    href="/login" 
                    variant="body2"
                    sx={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.preventDefault()
                      router.push('/login')
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
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="xs">
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </Container>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}