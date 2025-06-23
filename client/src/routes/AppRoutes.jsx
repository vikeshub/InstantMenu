import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../features/auth/components/LoginPage';
import Demo from '../pages/Demo';
import SignupPage from '../features/auth/components/SignupPage';
import RestaurantLanding from '../pages/RestaurantLanding';
import RestaurantSignup from '../pages/RestaurantSignup';
import RestaurantLogin from '../pages/RestaurantLogin';
import RestaurantProfile from '../pages/RestaurantProfile';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<Demo />} />

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/restaurant" element={<RestaurantLanding />} />
      <Route path="/restaurant/signup" element={<RestaurantSignup />} />
      <Route path="/restaurant/login" element={<RestaurantLogin />} />
      <Route path="/restaurant/profile" element={<RestaurantProfile />} />
    </Routes>
  </Router>
);

export default AppRoutes;
