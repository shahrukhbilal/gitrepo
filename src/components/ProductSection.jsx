import React, { useEffect, useState } from 'react';

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    min: '',
    max: '',
    sort: '',
  });

  // ✅ Move this outside so it's reusable
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.min) params.append('min', filters.min);
      if (filters.max) params.append('max', filters.max);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await fetch(`http://localhost:5000/api/products?${params}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="electronics">Electronics</option>
          {/* Use real category slugs or IDs if available */}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.min}
          onChange={(e) => setFilters({ ...filters, min: e.target.value })}
          className="border px-3 py-2 rounded w-28"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.max}
          onChange={(e) => setFilters({ ...filters, max: e.target.value })}
          className="border px-3 py-2 rounded w-28"
        />

        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="border px-3 py-2 rounded"
        >
          <option value="">Sort by</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>

        <button
          onClick={fetchProducts}
          className="bg-yellow-400 px-4 py-2 rounded font-semibold hover:bg-yellow-500"
        >
          Apply Filters
        </button>
      </div>

      <section className="py-10 px-4 sm:px-8 md:px-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Latest Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              <a
                href={`/product/${product.slug}`}
                className="inline-block mt-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-full"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProductSection;
