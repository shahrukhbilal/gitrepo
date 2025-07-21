import React, { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState([]);

  // ✅ Get token from localStorage or Redux (update if you use Redux)
  const token = localStorage.getItem('token');

  // ✅ Fetch all admin users
  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch admin users');
        }

        const data = await res.json();
        setAdminUsers(data); // adjust based on backend response
      } catch (err) {
        console.error('Error fetching admin users:', err.message);
      }
    };

    fetchAdminUsers();
  }, []);
// Inside AdminUsers.jsx

const handleDelete = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this user?");
  if (!confirm) return;

  try {
    const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Admin token
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    // Remove from UI
    setAdminUsers(adminUsers.filter((user) => user._id !== id));
  } catch (error) {
    console.error("Delete Error:", error);
  }
};

  return (
    <div className="bg-white shadow-md rounded-xl overflow-x-auto mt-6">
  <table className="min-w-full text-sm text-left text-gray-600">
    <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
      <tr>
        <th className="px-6 py-4">#</th>
        <th className="px-6 py-4">Name</th>
        <th className="px-6 py-4">Email</th>
        <th className="px-6 py-4">Role</th>
        <th className="px-6 py-4">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {adminUsers.map((user, index) => (
        <tr key={user._id} className="hover:bg-gray-50 transition">
          <td className="px-6 py-3 font-medium text-gray-900">{index + 1}</td>
          <td className="px-6 py-3">{user.name}</td>
          <td className="px-6 py-3">{user.email}</td>
          <td className="px-6 py-3">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {user.isAdmin ? 'Admin' : 'User'}
            </span>
          </td>
          <td className="px-6 py-3">
            <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
            <button onClick={()=>handleDelete(user._id)} className="text-red-600 hover:text-red-800">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default AdminUsers;
