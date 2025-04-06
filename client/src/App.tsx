import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import Restaurants from './pages/Restaurants';
// import Orders from './pages/Orders';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route>
          <Route path="/" element= {
            <ProtectedRoute>
              <Layout> 
                <Home/>
              </Layout>
            </ProtectedRoute>
            } />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Protected Routes wrapped with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/orders" element={<Orders />} /> */}
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
