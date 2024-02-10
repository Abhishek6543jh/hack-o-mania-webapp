// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import Login from './components/Login';
import Register from './components/reg';
import AdminPage from './components/AdminPage';
import FarmerDashboard from './components/FarmerDashboard';

const App = () => {
  return (
    <ChakraProvider>
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/reg" element={<Register />} />
      <Route path="/admin-dashboard" element={<AdminPage />} />
      <Route path="/farmer-dashboard" element={<FarmerDashboard />} />

      </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
