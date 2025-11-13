// src/components/Alerts/AlertList.jsx

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Checkbox,
  Grid,
  Alert as MuiAlert,
} from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { acknowledgeAlert } from '../../api/alerts';
import { formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-toastify';

const AlertList = ({ alerts, selectedAlerts = [], onSelectAlert, refetch }) => {
  const queryClient = useQueryClient();

  const acknowledgeMutation = useMutation({
    mutationFn: acknowledgeAlert,
    onSuccess: () => {
      queryClient.invalidateQueries(['alerts']);
      toast.success('Alert acknowledged!');
      if (refetch) refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to acknowledge alert');
    },
  });

  const handleSelectAlert = (alertId) => {
    if (!onSelectAlert) return;
    
    if (selectedAlerts.includes(alertId)) {
      onSelectAlert(selectedAlerts.filter((id) => id !== alertId));
    } else {
      onSelectAlert([...selectedAlerts, alertId]);
    }
  };

  const handleAcknowledge = (alertId) => {
    acknowledgeMutation.mutate(alertId);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  if (alerts.length === 0) {
    return (
      <MuiAlert severity="info">
        No alerts found
      </MuiAlert>
    );
  }

  return (
    <Grid container spacing={2}>
      {alerts.map((alert) => (
        <Grid item xs={12} key={alert.alert_id}>
          <Card
            variant="outlined"
            sx={{
              borderLeft: 4,
              borderLeftColor: `${getSeverityColor(alert.severity)}.main`,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="start" gap={2}>
                {/* Checkbox */}
                {onSelectAlert && !alert.is_acknowledged && (
                  <Checkbox
                    checked={selectedAlerts.includes(alert.alert_id)}
                    onChange={() => handleSelectAlert(alert.alert_id)}
                  />
                )}

                {/* Alert Content */}
                <Box flexGrow={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {alert.reactor_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alert.field_name?.replace(/_/g, ' ').toUpperCase()}
                      </Typography>
                    </Box>
                    <Chip
                      label={alert.severity?.toUpperCase()}
                      color={getSeverityColor(alert.severity)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body1" gutterBottom>
                    {alert.message}
                  </Typography>

                  <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      Current: <strong>{alert.current_value?.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Threshold: <strong>{alert.threshold_value?.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(alert.created_at)}
                    </Typography>
                  </Box>

                  {alert.is_acknowledged && (
                    <Box mt={1}>
                      <Chip
                        label={`Acknowledged by ${alert.acknowledged_by_username || 'Unknown'}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  )}
                </Box>

                {/* Actions */}
                {!alert.is_acknowledged && !onSelectAlert && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CheckIcon />}
                    onClick={() => handleAcknowledge(alert.alert_id)}
                    disabled={acknowledgeMutation.isPending}
                  >
                    Acknowledge
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AlertList;