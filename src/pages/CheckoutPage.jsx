import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items || []);
  const { user } = useSelector((state) => state.auth);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New States for shipping info
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
  });

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // COD order place
  const handleCOD = async (e) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
      setError('Please fill in all shipping details.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingInfo,
          paymentMethod: 'COD',
          totalAmount,
          isPaid: false,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to place order');
      }

      navigate('/thankyou');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Stripe payment logic (unchanged)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
      setError('Please fill in all shipping details.');
      return;
    }

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
          billing_details: { name: shippingInfo.name },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Save order after successful payment
        await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            orderItems: cartItems,
            shippingInfo,
            paymentMethod: 'Stripe',
            totalAmount,
            isPaid: true,
          }),
        });

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
    <div className="checkout" style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>Checkout</h2>

      {/* Shipping Info Form */}
      <form onSubmit={paymentMethod === 'stripe' ? handleSubmit : handleCOD}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingInfo.city}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={shippingInfo.phone}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        {/* Payment Method Selection */}
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="radio"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={() => setPaymentMethod('stripe')}
            />
            Pay with Card (Stripe)
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
            />
            Cash on Delivery
          </label>
        </div>

        {/* Stripe Card Element */}
        {paymentMethod === 'stripe' && (
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <CardElement />
          </div>
        )}

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6772e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : paymentMethod === 'stripe' ? `Pay ₹${totalAmount}` : 'Place COD Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;

