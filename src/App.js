// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import Login from './components/Login';

import AdminPage from './components/AdminPage';
import FarmerDashboard from './components/FarmerDashboard';
import Register from './components/reg';



const App = () => {
  return (
    <ChakraProvider>
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin-dashboard" element={<AdminPage />} />
      <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
      <Route path="/farmer-restration" element={<Register />} />
      

      </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
