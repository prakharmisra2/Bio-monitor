// src/pages/Profile.jsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Lock as LockIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/helpers';

const Profile = () => {
  const { user, updateProfile, changePassword, isUpdatingProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setPasswordError('');
  };

  const handleSaveProfile = () => {
    updateProfile(profileData);
    setEditMode(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    
    setOpenPasswordDialog(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Manage your account information
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Personal Information
                </Typography>
                {!editMode ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                    size="small"
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    variant="contained"
                    size="small"
                    disabled={isUpdatingProfile}
                  >
                    Save
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />

              {editMode ? (
                <Box>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    margin="normal"
                  />
                  <Button
                    variant="outlined"
                    onClick={() => setEditMode(false)}
                    sx={{ mt: 2 }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <List>
                  <ListItem>
                    <ListItemText primary="Full Name" secondary={user?.fullName} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Username" secondary={user?.username} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Email" secondary={user?.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Role"
                      secondary={
                        <Chip
                          label={user?.role?.replace('_', ' ').toUpperCase()}
                          size="small"
                          color="primary"
                        />
                      }
                    />
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Account Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemText
                    primary="User ID"
                    secondary={user?.userId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Account Created"
                    secondary={formatDate(user?.createdAt)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Login"
                    secondary={formatDate(user?.lastLogin)}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={() => setOpenPasswordDialog(true)}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Assigned Reactors */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Assigned Reactors
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {user?.assignedReactors && user.assignedReactors.length > 0 ? (
                <Grid container spacing={2}>
                  {user.assignedReactors.map((reactor) => (
                    <Grid item xs={12} sm={6} md={4} key={reactor.reactor_id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {reactor.reactor_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reactor.location || 'No location'}
                          </Typography>
                          <Box mt={1}>
                            <Chip
                              label={reactor.access_level?.toUpperCase()}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  No reactors assigned yet. Contact your administrator to get access.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => {
          setOpenPasswordDialog(false);
          setPasswordError('');
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
            helperText="Minimum 6 characters"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
            error={
              passwordData.confirmPassword &&
              passwordData.newPassword !== passwordData.confirmPassword
            }
            helperText={
              passwordData.confirmPassword &&
              passwordData.newPassword !== passwordData.confirmPassword
                ? 'Passwords do not match'
                : ''
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenPasswordDialog(false);
            setPasswordError('');
            setPasswordData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              passwordData.newPassword !== passwordData.confirmPassword ||
              passwordData.newPassword.length < 6
            }
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;