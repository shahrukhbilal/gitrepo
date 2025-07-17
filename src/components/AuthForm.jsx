import React, { useState, useRef } from 'react';
import { useLoginMutation, useRegisterMutation } from '../redux/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  const [login, { isLoading: loggingIn }] = useLoginMutation();
  const [register, { isLoading: registering }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nameInputRef = useRef(null);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: '', email: '', password: '' });
    setTimeout(() => {
      if (nameInputRef.current) nameInputRef.current.focus();
    }, 100);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const { fullName, email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || (!isLogin && !fullName)) {
      toast.error('All fields are required!');
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address!');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.fullName, email: formData.email, password: formData.password };

      const res = isLogin
        ? await login(payload).unwrap()
        : await register(payload).unwrap();

      dispatch(setCredentials({ token: res.token, user: res.user }));
      setFormData({ fullName: '', email: '', password: '' });
      toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? '👤 User Login' : '📝 Register'}
        </h3>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
                autoFocus
                ref={nameInputRef}
                autoComplete="off"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn || registering}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition duration-300"
          >
            {loggingIn || registering
              ? isLogin ? 'Logging in...' : 'Registering...'
              : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleForm} className="text-yellow-500 font-medium hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AuthForm;
