import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items || []);

const totalAmount = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

  const { user } = useSelector((state) => state.auth); // assuming auth slice
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          Authorization: `Bearer ${user?.token}`, // include if using JWT
        },
        body: JSON.stringify({ amount: totalAmount * 100 }), // Stripe requires amount in cents
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create payment intent');
      }

      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: elements.getElement(CardElement),
    billing_details: { name: 'Your Name' },
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
    <div className="checkout" style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <CardElement />
        </div>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <button
          type="submit"
          disabled={!stripe || loading}
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
          {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
