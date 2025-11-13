// src/components/Alerts/AlertCard.jsx

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { formatRelativeTime } from '../../utils/helpers';

const AlertCard = ({ alert, onAcknowledge }) => {
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

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: 4,
        borderLeftColor: `${getSeverityColor(alert.severity)}.main`,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Box flexGrow={1}>
            <Typography variant="h6" fontWeight="bold">
              {alert.reactor_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {alert.field_name?.replace(/_/g, ' ').toUpperCase()}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={alert.severity?.toUpperCase()}
              color={getSeverityColor(alert.severity)}
              size="small"
            />
            {!alert.is_acknowledged && onAcknowledge && (
              <IconButton size="small" onClick={() => onAcknowledge(alert.alert_id)}>
                <CheckIcon />
              </IconButton>
            )}
          </Box>
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
      </CardContent>
    </Card>
  );
};

export default AlertCard;