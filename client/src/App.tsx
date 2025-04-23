import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
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
import SettingsPage from './pages/Settings';
import ProfilePage from './pages/Profile';
import RoleManagement from './components/RoleManagement';
import RestaurantManagement from './pages/RestaurantManagement';
import MenuDetailsPage from './pages/MenuDetails';
import AdminRestaurantList from './components/AdminRestaurantList';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './components/RestaurantDetails';
import AboutPage from './pages/About';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route>
          <Route path="/" element= {
              <MainLayout> 
                <Home/>
              </MainLayout>  
            } />
          <Route path="/about" element= {
              <MainLayout> 
                <AboutPage/>
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
          <Route path="/settings" element={<SettingsPage />} /> 
          <Route path="/profile" element={<ProfilePage />} /> 
          <Route path="/role-management" element={<RoleManagement />} /> 

          <Route path="/menu/:menuId" element={<MenuDetailsPage />} />



          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/restaurant" element={<RestaurantOwnerDashboard />} />
          <Route path="/dashboard/delivery" element={<DeliveryDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/restaurant-management" element={<RestaurantManagement />} />
          <Route path="/restaurant-applications" element={<AdminRestaurantList />} />


          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />




        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
