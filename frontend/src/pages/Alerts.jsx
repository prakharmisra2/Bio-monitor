// src/pages/Alerts.jsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { getAllAlerts, acknowledgeMultipleAlerts } from '../api/alerts';
import { getReactors } from '../api/reactors';
import useAuthStore from '../store/authStore';
import Loading from '../components/Common/Loading';
import ErrorMessage from '../components/Common/ErrorMessage';
import SetPointForm from '../components/Alerts/SetPointForm';
import AlertList from '../components/Alerts/AlertList';
import { toast } from 'react-toastify';

const Alerts = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState([]);

  // Fetch alerts
  const {
    data: alertsData,
    isLoading: loadingAlerts,
    error: alertsError,
    refetch: refetchAlerts,
  } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => getAllAlerts(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch reactors
  const { data: reactorsData } = useQuery({
    queryKey: ['reactors'],
    queryFn: getReactors,
  });

  // Acknowledge multiple alerts mutation
  const acknowledgeMutation = useMutation({
    mutationFn: acknowledgeMultipleAlerts,
    onSuccess: () => {
      queryClient.invalidateQueries(['alerts']);
      setSelectedAlerts([]);
      toast.success('Alerts acknowledged successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to acknowledge alerts');
    },
  });

  const alerts = alertsData?.data || [];
  const reactors = reactorsData?.data || [];

  const unacknowledgedAlerts = alerts.filter((a) => !a.is_acknowledged);
  const acknowledgedAlerts = alerts.filter((a) => a.is_acknowledged);
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && !a.is_acknowledged);

  const handleAcknowledgeSelected = () => {
    if (selectedAlerts.length > 0) {
      acknowledgeMutation.mutate(selectedAlerts);
    }
  };

  if (loadingAlerts) return <Loading message="Loading alerts..." />;
  if (alertsError) return <ErrorMessage message={alertsError.message} onRetry={refetchAlerts} />;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Alerts & SetPoints
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage reactor alerts
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          {selectedAlerts.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<CheckIcon />}
              onClick={handleAcknowledgeSelected}
              disabled={acknowledgeMutation.isPending}
            >
              Acknowledge ({selectedAlerts.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add SetPoint
          </Button>
        </Box>
      </Box>

      {/* Alert Summary */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Unacknowledged
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {unacknowledgedAlerts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Critical
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {criticalAlerts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Alerts
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {alerts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                Unacknowledged
                {unacknowledgedAlerts.length > 0 && (
                  <Chip
                    label={unacknowledgedAlerts.length}
                    size="small"
                    color="warning"
                  />
                )}
              </Box>
            }
          />
          <Tab label="Acknowledged" />
          <Tab label="All Alerts" />
        </Tabs>
      </Box>

      {/* Alert Lists */}
      {tabValue === 0 && (
        <AlertList
          alerts={unacknowledgedAlerts}
          selectedAlerts={selectedAlerts}
          onSelectAlert={setSelectedAlerts}
          refetch={refetchAlerts}
        />
      )}
      {tabValue === 1 && <AlertList alerts={acknowledgedAlerts} refetch={refetchAlerts} />}
      {tabValue === 2 && (
        <AlertList
          alerts={alerts}
          selectedAlerts={selectedAlerts}
          onSelectAlert={setSelectedAlerts}
          refetch={refetchAlerts}
        />
      )}

      {/* SetPoint Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <SetPointForm
          reactors={reactors}
          onClose={() => setOpenDialog(false)}
          onSuccess={() => {
            setOpenDialog(false);
            queryClient.invalidateQueries(['setpoints']);
          }}
        />
      </Dialog>
    </Box>
  );
};

export default Alerts;