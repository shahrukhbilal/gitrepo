import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersPage from '../pages/admin/UsersPage';
import OrdersPage from '../pages/admin/OrdersPage';
import ProductsPage from '../pages/admin/ProductsPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UsersPage />} />
      <Route path="/admin/products" element={<ProductsPage />} />
      <Route path="/admin/orders" element={<OrdersPage />} />
    </Routes>
  );
};

export default AdminRoutes;
