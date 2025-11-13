// src/pages/ReactorsList.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getReactors, createReactor } from '../api/reactors';
import useAuthStore from '../store/authStore';
import Loading from '../components/Common/Loading';
import ErrorMessage from '../components/Common/ErrorMessage';
import ReactorCard from '../components/Reactor/ReactorCard';
import { toast } from 'react-toastify';

const ReactorsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    reactorName: '',
    location: '',
    description: '',
    dataRetentionDays: 365,
  });

  // Fetch reactors
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reactors'],
    queryFn: getReactors,
  });

  // Create reactor mutation
  const createMutation = useMutation({
    mutationFn: createReactor,
    onSuccess: () => {
      queryClient.invalidateQueries(['reactors']);
      setOpenDialog(false);
      setFormData({
        reactorName: '',
        location: '',
        description: '',
        dataRetentionDays: 365,
      });
      toast.success('Reactor created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create reactor');
    },
  });

  const reactors = data?.data || [];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      reactorName: '',
      location: '',
      description: '',
      dataRetentionDays: 365,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <Loading message="Loading reactors..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Reactors
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor your bioreactors
          </Typography>
        </Box>
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Reactor
          </Button>
        )}
      </Box>

      {/* Reactors Grid */}
      {reactors.length === 0 ? (
        <Alert severity="info">
          No reactors available. {user?.role === 'admin' && 'Click "Add Reactor" to create one.'}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {reactors.map((reactor) => (
            <Grid item xs={12} sm={6} md={4} key={reactor.reactor_id}>
              <ReactorCard
                reactor={reactor}
                onClick={() => navigate(`/reactors/${reactor.reactor_id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Reactor Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create New Reactor</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Reactor Name"
              name="reactorName"
              value={formData.reactorName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Data Retention (Days)"
              name="dataRetentionDays"
              type="number"
              value={formData.dataRetentionDays}
              onChange={handleChange}
              margin="normal"
              inputProps={{ min: 1, max: 3650 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ReactorsList;