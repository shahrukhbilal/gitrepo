// src/pages/AuthForm.jsx
import React, { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from '../redux/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  const [login, { isLoading: loggingIn }] = useLoginMutation();
  const [register, { isLoading: registering }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const payload = isLogin
   ? { email: formData.email, password: formData.password }
  : { name: formData.fullName, email: formData.email, password: formData.password };

      const res = isLogin
        ? await login(payload).unwrap()
        : await register(payload).unwrap();

      dispatch(setCredentials({ token: res.token, user: res.user }));
      navigate('/my-orders');
    } catch (err) {
      alert(err.data?.message || 'Something went wrong');
    }
  };

  const isSubmitting = loggingIn || registering;
  const btnLabel = isLogin
    ? (loggingIn ? 'Logging in...' : 'Login')
    : (registering ? 'Registering...' : 'Register');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Login to Your Account' : 'Create New Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none py-2 placeholder-transparent"
                placeholder="Full Name"
              />
              <label className="absolute left-0 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
                
              </label>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none py-2 placeholder-transparent"
              placeholder="Email Address"
            />
            <label className="absolute left-0 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
              
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none py-2 placeholder-transparent"
              placeholder="Password"
            />
            <label className="absolute left-0 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
              
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-yellow-400 hover:bg-yellow-500'} text-black font-semibold py-2 rounded-xl transition duration-300`}
          >
            {btnLabel}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleForm} className="text-yellow-500 font-medium hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
