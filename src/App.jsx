import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout';
import SimpleLayout from './SimpleLayout';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/Thankyou';
import MyOrdersPage from './pages/MyOdersPage';
import AuthForm from './components/AuthForm';
import Shop from './pages/Shop';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FeedbackPage from './pages/FeedbackPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Home page with full layout */}
        <Route path='/' element={<MainLayout />} />

        {/* 🧭 All other pages with simple layout */}
        <Route element={<SimpleLayout />}>
          <Route path='/product/:slug' element={<ProductDetailPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/thankyou' element={<ThankYouPage />} />
          <Route path='/my-orders' element={<MyOrdersPage />} />
          <Route path='/login' element={<AuthForm />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/feedback' element={<FeedbackPage />} />
          <Route path='/admin/login' element={<AdminLogin />}></Route>
          <Route path='/admin/dashbooard' element={<AdminDashboard/>}></Route>
        </Route>
        <Route path='/admin' element={<AdminDashboard/>}></Route>
      </Routes>

      {/* ✅ Global Toast Container for Notifications */}
      <ToastContainer position='top-right' autoClose={3000} />
    </Router>
  );
}

export default App;
