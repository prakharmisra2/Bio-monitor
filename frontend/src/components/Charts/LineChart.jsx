// src/components/Charts/LineChart.jsx

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const LineChart = ({ data, fieldName, title, color = '#1976d2', height = 400 }) => {
  // Prepare chart data
  const chartData = data.map((item) => ({
    timestamp: format(new Date(item.timestamp), 'MM/dd HH:mm'),
    value: item[fieldName],
    fullTimestamp: item.timestamp,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="caption" display="block">
            {format(new Date(payload[0].payload.fullTimestamp), 'MMM dd, yyyy HH:mm:ss')}
          </Typography>
          <Typography variant="body2" fontWeight="bold" color={color}>
            {title}: {payload[0].value?.toFixed(2)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            {title}
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={height}
          >
            <Typography variant="body2" color="text.secondary">
              No data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              name={title}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            Data points: {chartData.length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Latest: {chartData[chartData.length - 1]?.value?.toFixed(2) || 'N/A'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LineChart;