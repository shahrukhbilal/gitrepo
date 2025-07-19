import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ✅ Redux auth state se token & user le rahe hain
  const { user, token } = useSelector((state) => state.auth);

  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // ✅ Unauthorized user ko redirect karo
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    // ✅ Admin data fetch
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ Proper Bearer token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }

        const data = await response.json();
        setAdminData(data);
      } catch (error) {
        console.error('Admin fetch error:', error.message);
      }
    };

    fetchAdminData();
  }, [user, token, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {adminData ? (
        <div className="bg-white p-4 rounded shadow">
          <p><strong>Name:</strong> {adminData.name}</p>
          <p><strong>Email:</strong> {adminData.email}</p>
          <p><strong>Admin ID:</strong> {adminData._id}</p>
        </div>
      ) : (
        <p>Loading admin data...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
