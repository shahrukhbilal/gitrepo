import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const cartItems = useSelector(state => state.cart.items);
  const token = useSelector(state => state.auth.token); // ✅ Correct way
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    address: '', city: '', zip: '',
    paymentMethod: 'cash'
  });

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!cartItems.length) {
      alert('Your cart is empty.');
      return;
    }

    const orderData = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      zip: form.zip,
      paymentMethod: form.paymentMethod,
      items: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total
    };

    console.log("Order data being sent:", orderData);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ This will now work
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Order Placed Successfully!');
        navigate('/thankyou');
      } else {
        alert(`❌ Order failed: ${data.message || data.error}`);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('❌ Something went wrong');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Checkout</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 shadow rounded-lg">
        {['fullName', 'email', 'phone', 'address', 'city', 'zip'].map(name => (
          <input
            key={name}
            type={name === 'email' ? 'email' : 'text'}
            name={name}
            value={form[name]}
            onChange={handleChange}
            required
            placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
            className="border p-3 rounded"
          />
        ))}
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">Payment Method:</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="border p-3 rounded w-full"
          >
            <option value="cash">Cash on Delivery</option>
            <option value="stripe">Credit/Debit Card (Stripe)</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
          {cartItems.map(item => (
            <div key={item._id} className="flex justify-between border-b py-2">
              <span>{item.name} × {item.quantity}</span>
              <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total:</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
        </div>
        <button
          type="submit"
          className="md:col-span-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
