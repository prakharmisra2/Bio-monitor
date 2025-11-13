// src/api/alerts.js

import axios from './axios';

// ============================================
// SETPOINTS
// ============================================

// Create setpoint
export const createSetPoint = async (reactorId, setpointData) => {
  const response = await axios.post(`/setpoints/${reactorId}`, setpointData);
  return response.data;
};

// Get setpoints for reactor
export const getSetPoints = async (reactorId, params = {}) => {
  const response = await axios.get(`/setpoints/${reactorId}`, { params });
  return response.data;
};

// Get user's setpoints
export const getUserSetPoints = async (reactorId) => {
  const response = await axios.get('/setpoints/user/my-setpoints', {
    params: { reactorId }
  });
  return response.data;
};

// Update setpoint
export const updateSetPoint = async (setpointId, updates) => {
  const response = await axios.put(`/setpoints/update/${setpointId}`, updates);
  return response.data;
};

// Delete setpoint
export const deleteSetPoint = async (setpointId) => {
  const response = await axios.delete(`/setpoints/${setpointId}`);
  return response.data;
};

// ============================================
// ALERTS
// ============================================

// Get alerts for reactor
export const getAlerts = async (reactorId, params = {}) => {
  const response = await axios.get(`/alerts/${reactorId}`, { params });
  return response.data;
};

// Get all alerts (admin only)
export const getAllAlerts = async (params = {}) => {
  const response = await axios.get('/alerts/all', { params });
  return response.data;
};

// Get unacknowledged alerts
export const getUnacknowledgedAlerts = async (reactorId) => {
  const response = await axios.get(`/alerts/${reactorId}/unacknowledged`);
  return response.data;
};

// Get alert statistics
export const getAlertStats = async (reactorId) => {
  const response = await axios.get(`/alerts/${reactorId}/statistics`);
  return response.data;
};

// Get alert by ID
export const getAlertById = async (alertId) => {
  const response = await axios.get(`/alerts/detail/${alertId}`);
  return response.data;
};

// Acknowledge alert
export const acknowledgeAlert = async (alertId) => {
  const response = await axios.put(`/alerts/${alertId}/acknowledge`);
  return response.data;
};

// Acknowledge multiple alerts
export const acknowledgeMultipleAlerts = async (alertIds) => {
  const response = await axios.post('/alerts/acknowledge-multiple', { alertIds });
  return response.data;
};