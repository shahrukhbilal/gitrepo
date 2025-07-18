// src/admin/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function AdminSidebar() {
  return (
    <div className="w-90 min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
      <ul className="space-y-4">
        <li><Link to="/admin/dashboard" className="hover:text-yellow-400">Dashboard</Link></li>
        <li><Link to="/admin/products" className="hover:text-yellow-400">Products</Link></li>
        <li><Link to="/admin/users" className="hover:text-yellow-400">Users</Link></li>
        <li><Link to="/admin/orders" className="hover:text-yellow-400">Orders</Link></li>
        <li><Link to="/admin/messages" className="hover:text-yellow-400">Messages</Link></li>
        <li><Link to="/" className="hover:text-yellow-400">Back to Site</Link></li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
