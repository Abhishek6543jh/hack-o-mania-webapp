// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import Login from './components/Login';
import Register from './components/reg';
import AdminPage from './components/AdminPage';
import FarmerDashboard from './components/FarmerDashboard';
import CreateFolder from './components/CreateFolder';
import AssignFolder from './components/AssignFolder';
import AllFolders from './components/FolderDetails';

const App = () => {
  return (
    <ChakraProvider>
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/reg" element={<Register />} />
      <Route path="/admin-dashboard" element={<AdminPage />} />
      <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
      <Route path="/create-folder" element={<CreateFolder />} />
        <Route path="/assign-folder" element={<AssignFolder />} />
        <Route path="/folder-details" element={<AllFolders />} />

      </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
