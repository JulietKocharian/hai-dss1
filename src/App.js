// src/App.js
// Հիմնական App բաղադրիչ - ամբողջ հավելվածի մուտքակետ

import React from 'react';
import { DataProvider } from './context/DataContext';
import Analysis from './pages/Analysis/Analysis';
import Home from './pages/Home/Home';
import { Routes, Route } from 'react-router-dom';

import "./index.css"
import Header from './components/Header/Header';
import SignIn from './pages/SignIn/SignIn';
import MyProfile from './pages/MyProfile/MyProfile';
const App = () => {
  return (
    <DataProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/my-profile" element={<MyProfile />} />
      </Routes>
    </DataProvider>
  );
};

export default App;