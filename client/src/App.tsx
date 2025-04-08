import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import Restaurants from './pages/Restaurants';
// import Orders from './pages/Orders';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';
import CustomerDashboard from './components/CustomerDashboard';
import RestaurantOwnerDashboard from './components/RestaurantOwnerDashboard';
import DeliveryDashboard from './components/DeliveryPersonDashboard';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route>
          <Route path="/" element= {
              <MainLayout> 
                <Home/>
              </MainLayout>  
            } />
       
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        <Route
          element={
            <ProtectedRoute>
              <AuthLayout />
            </ProtectedRoute>
          }
        >
          {/* <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/orders" element={<Orders />} /> */}
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/restaurant" element={<RestaurantOwnerDashboard />} />
          <Route path="/dashboard/delivery" element={<DeliveryDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
