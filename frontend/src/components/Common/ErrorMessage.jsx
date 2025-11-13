// src/components/Common/ErrorMessage.jsx

import React from 'react';
import { Box, Alert, AlertTitle, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const ErrorMessage = ({ message = 'An error occurred', onRetry = null }) => {
  return (
    <Box p={3}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {message}
        {onRetry && (
          <Button
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ mt: 1 }}
            size="small"
          >
            Retry
          </Button>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;