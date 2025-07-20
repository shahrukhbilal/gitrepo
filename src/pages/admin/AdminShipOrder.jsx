import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AdminShipOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleShip = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "shipped" }),
      });

      if (res.ok) {
        alert("✅ Order marked as shipped!");
        navigate("/admin/orders");
      } else {
        alert("❌ Failed to update status");
      }
    } catch (error) {
      console.error("Failed to mark as shipped:", error);
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">🚚 Ship Order</h2>

      {/* Customer Info */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">👤 Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
          <p><span className="font-medium">Name:</span> {order.fullName}</p>
          <p><span className="font-medium">Email:</span> {order.email}</p>
          <p><span className="font-medium">Phone:</span> {order.phone}</p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">🏠 Shipping Address</h3>
        <div className="text-gray-600">
          <p>{order.address}</p>
          <p>{order.city}, {order.zip}</p>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">🛒 Ordered Items</h3>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
              <span>{item.name} <span className="text-sm text-gray-500">(x{item.quantity})</span></span>
              <span className="font-medium text-gray-800">Rs. {item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mark Shipped Button */}
      <div className="text-right mt-6">
        <button
          onClick={handleShip}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 shadow-lg transition duration-300"
        >
          ✅ Mark as Shipped
        </button>
      </div>
    </div>
  );
}

export default AdminShipOrder;
