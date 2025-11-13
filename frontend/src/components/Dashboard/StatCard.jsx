// src/components/Dashboard/StatCard.jsx

import React from 'react';
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';

const StatCard = ({ title, value, icon, color = 'primary', isText = false }) => {
  const colorMap = {
    primary: '#1976d2',
    success: '#2e7d32',
    warning: '#ed6c02',
    error: '#d32f2f',
    info: '#0288d1',
  };

  const bgColor = colorMap[color] || colorMap.primary;

  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: bgColor,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;