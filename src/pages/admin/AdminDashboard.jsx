import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-30 p-6 w-400">
        <h1 className="text-3xl font-semibold mb-6">Welcome to Admin Dashboard</h1>
        {/* Future: Add cards/analytics here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">Users</div>
          <div className="bg-white p-4 rounded shadow">Orders</div>
          <div className="bg-white p-4 rounded shadow">Products</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
