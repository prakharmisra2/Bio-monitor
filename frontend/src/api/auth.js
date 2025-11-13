// src/api/auth.js

import axios from './axios';

// Login
export const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await axios.post('/auth/logout');
  return response.data;
};

// Get current user profile
export const getProfile = async () => {
  const response = await axios.get('/auth/profile');
  return response.data;
};

// Update profile
export const updateProfile = async (profileData) => {
  const response = await axios.put('/auth/profile', profileData);
  return response.data;
};

// Change username
export const changeUsername = async (newUsername) => {
  const response = await axios.put('/auth/username', { newUsername });
  return response.data;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await axios.put('/auth/password', passwordData);
  return response.data;
};

// Refresh token
export const refreshToken = async (refreshToken) => {
  const response = await axios.post('/auth/refresh', { refreshToken });
  return response.data;
};