// src/api/reactors.js

import axios from './axios';

// Get all reactors
export const getReactors = async () => {
  const response = await axios.get('/reactors');
  return response.data;
};

// Get reactor by ID
export const getReactorById = async (reactorId) => {
  const response = await axios.get(`/reactors/${reactorId}`);
  return response.data;
};

// Create reactor (admin only)
export const createReactor = async (reactorData) => {
  const response = await axios.post('/reactors', reactorData);
  return response.data;
};

// Update reactor (admin only)
export const updateReactor = async (reactorId, reactorData) => {
  const response = await axios.put(`/reactors/${reactorId}`, reactorData);
  return response.data;
};

// Delete reactor (admin only)
export const deleteReactor = async (reactorId) => {
  const response = await axios.delete(`/reactors/${reactorId}`);
  return response.data;
};

// Get reactor statistics
export const getReactorStatistics = async (reactorId) => {
  const response = await axios.get(`/reactors/${reactorId}/statistics`);
  return response.data;
};

// Get reactor status
export const getReactorStatus = async (reactorId) => {
  const response = await axios.get(`/reactors/${reactorId}/status`);
  return response.data;
};

// Get reactor equipment
export const getReactorEquipment = async (reactorId) => {
  const response = await axios.get(`/reactors/${reactorId}/equipment`);
  return response.data;
};

// Get assigned users
export const getAssignedUsers = async (reactorId) => {
  const response = await axios.get(`/reactors/${reactorId}/users`);
  return response.data;
};