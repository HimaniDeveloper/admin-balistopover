'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Pagination,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Switch,
  Chip,
  FormControl,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Layout } from "@/components";
import { showToast } from '@/store/settingsSlice';
import { useDispatch } from 'react-redux';


export default function UsersPage() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    isActive: true,
    role: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search })
      });

      const response = await fetch(`/api/users?${params}`);
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setUsers(result.data.records);
        setPagination(prev => ({
          ...prev,
          total: result.data.pagination.total,
          totalPages: result.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message || 'Failed to fetch users' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search]);

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleOpenAddDialog = () => {
    setCurrentUser(null);
    setUserForm({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      isActive: true
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user) => {
    setCurrentUser(user);
    setUserForm({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      password: '',
      isActive: user.isActive
    });
    setOpenDialog(true);
  };

  const handleOpenPasswordDialog = (user) => {
    setCurrentUser(user);
    setPasswordForm({
      newPassword: '',
      confirmPassword: ''
    });
    setOpenPasswordDialog(true);
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: userId,
          isActive
        })
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(showToast({ type: "success", message: "User status updated successfully" }));
        fetchUsers();
      } else {
        dispatch(showToast({ type: "error", message: data.message || "Failed to update status" }));
      }
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message || "Failed to update status" }));
    }
  };

  const handleSaveUser = async () => {
    try {
      const url = '/api/users';
      const method = currentUser ? 'PUT' : 'POST';

      const payload = currentUser ? {
        _id: currentUser._id,
        name: userForm.name,
        phone: userForm.phone,
        role: userForm.role,
        isActive: userForm.isActive
      } : {
        name: userForm.name,
        username: userForm.username,
        email: userForm.email,
        phone: userForm.phone,
        role: userForm.role,
        password: userForm.password,
        isActive: userForm.isActive
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setOpenDialog(false);
        dispatch(showToast({ type: "success", message: currentUser ? "User updated successfully" : "User added successfully" }));
        fetchUsers();
      } else {
        dispatch(showToast({ type: "error", message: data.message || "Failed to save user" }));
      }
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message || "Failed to save user" }));
    }
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
          id: currentUser._id,
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

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId })
      });

      const data = await response.json();

      if (response.ok) {
        setDeleteConfirm(null);
        dispatch(showToast({ type: "success", message: "User deleted successfully" }));
        fetchUsers();
      } else {
        dispatch(showToast({ type: "error", message: data.message || "Failed to delete user" }));
      }
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message || "Failed to delete user" }));
    }
  };

  // Example roles
  const roles = ['admin', 'user'];

  return (
    <Layout title="Users">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search users..."
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add User
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No users found
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>
                        <Typography
                          color={
                            user.role === 'admin' ? 'primary' : 'textPrimary'
                          }
                          fontWeight={user.role === 'admin' ? 'bold' : 'normal'}
                        >
                          {user.role}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleOpenEditDialog(user)}>
                            <EditIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Change Password">
                          <IconButton onClick={() => handleOpenPasswordDialog(user)}>
                            <LockResetIcon color="secondary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => setDeleteConfirm(user._id)}
                            disabled={user.role === 'admin'}
                          >
                            <DeleteIcon color={user.role === 'admin' ? 'disabled' : 'error'} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'}>
                          <Switch
                            checked={user.isActive}
                            onChange={(e) => handleStatusChange(user._id, e.target.checked)}
                            color="success"
                            disabled={user.role === 'admin'}
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>

      {/* User Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{currentUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              required
            />

            {!currentUser && (
              <>
                <TextField
                  label="Username"
                  fullWidth
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  required
                />
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                />
              </>
            )}

            <TextField
              label="Phone"
              fullWidth
              value={userForm.phone}
              onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
            />

            {!currentUser && (
              <TextField
                label="Password"
                fullWidth
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required
              />
            )}

            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role-select"
                value={userForm.role || ''}
                label="Role"
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            disabled={
              !userForm.name ||
              (!currentUser && (!userForm.username || !userForm.email || !userForm.password))
            }
          >
            {currentUser ? 'Update' : 'Add'} User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Change Password for {currentUser?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="New Password"
              fullWidth
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            <TextField
              label="Confirm Password"
              fullWidth
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={!passwordForm.newPassword || !passwordForm.confirmPassword}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            onClick={() => handleDeleteUser(deleteConfirm)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}