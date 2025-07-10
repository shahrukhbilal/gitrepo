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


function App() {
  return (
    <Router>
      <Routes>
        {/* Home page with full layout */}
        <Route path='/' element={<MainLayout />}>
  
        </Route>

        {/* Other pages with minimal layout */}
        <Route element={<SimpleLayout />}>
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
<Route path='/checkout' element= {<CheckoutPage></CheckoutPage>}></Route>
<Route path='/thankyou' element= {<ThankYouPage></ThankYouPage>}></Route>
<Route path='/my-orders' element={<MyOrdersPage></MyOrdersPage>}></Route>
<Route path='/login' element= {<AuthForm></AuthForm>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
