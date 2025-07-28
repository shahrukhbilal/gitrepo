import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Mail,
  ArrowLeftCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

function AdminSidebar() {
    const dispatch= useDispatch()
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/stats' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
    { name: 'Feedback', icon: <Mail size={20} />, path: '/admin/contacts' },
    { name: 'Back to Site', icon: <ArrowLeftCircle size={20} />, path: '/', logout: true },
    { name: 'Upload Products',  path: '/admin/add-product'},
  ];

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-gray-900 text-white min-h-screen p-4 transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-yellow-400 transition duration-200"
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

      {/* Sidebar Title */}
      {!isCollapsed && (
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
      )}

      {/* Menu Items */}
      <ul className="space-y-6">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              onClick={() => {
                if (item.logout) {
                  localStorage.removeItem('token');
                  dispatch(logout())
                }
              }}
              className="flex items-center space-x-3 hover:text-yellow-400"
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminSidebar;
