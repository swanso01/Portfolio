import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrderMaterialsPage from './pages/OrderMaterialsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserAccountPage from './pages/UserAccountPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';

function AppRouter() {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/order"
        element={user && user.email ? <OrderMaterialsPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/account"
        element={
          user && user.email ? (
            user.isAdmin ? <AdminDashboardPage /> : <UserAccountPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;