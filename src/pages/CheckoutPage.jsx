import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items || []);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shipping details
  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ amount: totalAmount * 100 }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create payment intent');
      }

      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: shipping.fullName || 'Unknown' },
        },
        shipping: {
          name: shipping.fullName,
          address: {
            line1: shipping.address,
            city: shipping.city,
            state: shipping.state,
            postal_code: shipping.postalCode,
            country: shipping.country,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        navigate('/thankyou');
      } else {
        setError('Unexpected payment status.');
      }
    } catch (err) {
      console.error('Stripe payment error:', err);
      setError(err.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Info & Payment */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Shipping Information</h2>

          <input type="text" name="fullName" placeholder="Full Name" required
            value={shipping.fullName} onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded" />

          <input type="text" name="address" placeholder="Address" required
            value={shipping.address} onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="city" placeholder="City" required
              value={shipping.city} onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded" />

            <input type="text" name="state" placeholder="State" required
              value={shipping.state} onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="postalCode" placeholder="Postal Code" required
              value={shipping.postalCode} onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded" />

            <input type="text" name="country" placeholder="Country" required
              value={shipping.country} onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded" />
          </div>

          <h2 className="text-xl font-semibold pt-4">Payment Details</h2>

          <div className="p-4 border rounded bg-gray-50">
            <CardElement />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-3 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b">
              <span>{item.name}</span>
              <span>₹{item.price} × {item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg pt-4">
            <span>Total:</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
