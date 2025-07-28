// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${slug}`);
        const data = await res.json();
        setProduct(data);
        setMainImage(data.image);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  if (!product) return <p className="text-center py-20">Loading...</p>;

  const price = Number(product?.price);
  const oldPrice = Number(product?.oldPrice);

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto">
      <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg overflow-hidden p-6">
        {/* 🖼️ Product Images */}
        <div>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-xl border"
          />

          {product.thumbnails?.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.thumbnails.map((thumb, i) => (
                <button key={i} onClick={() => setMainImage(thumb)}>
                  <img
                    src={thumb}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    className={`w-full h-20 object-cover rounded-md border-2 transition ${
                      mainImage === thumb ? "border-yellow-500" : "border-gray-300"
                    } hover:border-yellow-400`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 📝 Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            <div className="mb-6">
              <span className="text-3xl font-bold text-yellow-500">
                ${!isNaN(price) ? price.toFixed(2) : "N/A"}
              </span>
              {!isNaN(oldPrice) && (
                <span className="ml-3 text-gray-500 line-through">
                  ${oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <label htmlFor="qty" className="font-medium">Quantity:</label>
              <input
                id="qty"
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          {/* 🛒 Action Buttons */}
          <div className="space-y-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg w-full transition"
            >
              🛒 Add to Cart
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition">
              ❤️ Add to Wishlist
            </button>

            <div className="text-sm text-gray-600 pt-2">
              <p><strong>SKU:</strong> {product.sku}</p>
              <p><strong>Category:</strong> {product.category}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
