import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../redux/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import toast from 'react-hot-toast';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isAdmin: false,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error('Email and Password are required');
      return false;
    }
    if (!isLogin && (!formData.name || !formData.confirmPassword)) {
      toast.error('All fields are required');
      return false;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isLogin) {
        const res = await login({
          email: formData.email,
          password: formData.password,
        }).unwrap();

        dispatch(setCredentials(res));
        toast.success('Login successful');

        console.log('🔐 Logged in:', res.user);
        res.user.isAdmin ? navigate('/admin') : navigate('/my-orders');
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          // role: formData.isAdmin ? 'admin' : 'user', // ✅ Fix here
        };

        const res = await register(payload).unwrap();

        dispatch(setCredentials(res));
        toast.success('Registration successful');

        console.log('✅ Registered:', res.user);
        res.user.isAdmin ? navigate('/admin') : navigate('/my-orders');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        {isLogin ? 'Login' : 'Register'}
      </h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>

        {!isLogin && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={formData.isAdmin}
                onChange={(e) =>
                  setFormData({ ...formData, isAdmin: e.target.checked })
                }
                className="mr-2"
              />
              <label className="text-sm">Register as Admin</label>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button className="text-blue-600 underline" onClick={toggleForm}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
