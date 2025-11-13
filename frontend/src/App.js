// src/App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSocket } from './hooks/useSocket';

// Layout
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReactorsList from './pages/ReactorsList';
import ReactorDetail from './pages/ReactorDetail';
import DataVisualization from './pages/DataVisualization';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function App() {
  // Initialize socket connection
  useSocket();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reactors" element={<ReactorsList />} />
        <Route path="reactors/:reactorId" element={<ReactorDetail />} />
        <Route path="reactors/:reactorId/data" element={<DataVisualization />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;