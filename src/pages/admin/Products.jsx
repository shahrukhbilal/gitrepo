import React, { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        fetchProducts(); // Refresh product list
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">All Products</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Slug</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {products?.map((product, index) => (
              <tr key={product._id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{product.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{product.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{product.category?.name || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
