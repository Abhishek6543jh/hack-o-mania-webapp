// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import { ChakraProvider } from '@chakra-ui/react'
import Login from './components/Login';




const App = () => {
  return (
    <ChakraProvider>
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
