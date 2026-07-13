'use client';
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Layout } from "@/components";
import { showToast } from '@/store/settingsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfilePage() {
    const dispatch = useDispatch();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const userInfo = useSelector((state) => state.auth.user);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenPasswordDialog = () => {
    setPasswordForm({
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setOpenPasswordDialog(true);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      dispatch(showToast({ type: "error", message: "Passwords don't match" }));
      return;
    }

    try {
      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          id: userInfo._id,
          password: passwordForm.newPassword
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setOpenPasswordDialog(false);
        dispatch(showToast({ type: "success", message: "Password changed successfully" }));
      } else {
        dispatch(showToast({ type: "error", message: data.message || "Failed to change password" }));
      }
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message || "Failed to change password" }));
    }
  };

  return (
    <Layout title="My Profile">
              <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3, 
          bgcolor: 'background.paper', 
          p: 4, 
          borderRadius: 2,
          boxShadow: 1
        }}>
          <Typography variant="body1">
            <strong>Name:</strong> {userInfo?.name}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {userInfo?.email}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {userInfo?.phone}
          </Typography>
          <Typography variant="body1">
            <strong>Role:</strong> {userInfo?.role}
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              startIcon={<LockResetIcon />}
              onClick={handleOpenPasswordDialog}
            >
              Change Password
            </Button>
          </Box>
        </Box>

      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {error && (
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            <TextField
              label="New Password"
              fullWidth
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              required
            />
            <TextField
              label="Confirm New Password"
              fullWidth
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained"
            disabled={
              loading || 
              !passwordForm.newPassword || 
              !passwordForm.confirmPassword
            }
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}