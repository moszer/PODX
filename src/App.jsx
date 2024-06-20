// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Connect from './Connect.jsx';

const App = () => (
  <Routes>
    <Route path="/Login" element={<Login />} />
    <Route path="/Register" element={<Register />} />
    <Route path="/Connect" element={<Connect />} />
  </Routes>
);

export default App;
