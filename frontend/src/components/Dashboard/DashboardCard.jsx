// src/components/Dashboard/DashboardCard.jsx

import React from 'react';
import { Card, CardContent, CardActionArea, Box, Typography } from '@mui/material';

const DashboardCard = ({ title, subtitle, icon, onClick, color = 'primary' }) => {
  return (
    <Card elevation={2}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 2,
                bgcolor: `${color}.light`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
            <Box flexGrow={1}>
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DashboardCard;