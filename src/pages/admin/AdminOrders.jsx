import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/admin/orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      // ✅ Update local UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`Status updated to "${newStatus}"`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete order");

      toast.success("Order deleted successfully!");
      fetchOrders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔵 Utility for status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500 text-white";
      case "shipped":
        return "bg-blue-500 text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white text-sm text-gray-800">
            <thead className="bg-gray-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{order._id}</td>
                  <td className="px-6 py-4">
                    {order.user?.name || order.fullName}
                  </td>
                  <td className="px-6 py-4">
                    {order.user?.email || order.email}
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc list-inside space-y-1">
                      {order.items.map((item, index) => (
                        <li key={item.productId || index}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </div>
                    <div className="mt-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={["delivered", "cancelled"].includes(
                          order.status
                        )}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        navigate(`/admin/orders/ship/${order._id}`)
                      }
                    >
                      Ship Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
