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

  return (
    <section className="py-12 px-4 sm:px-8 lg:px-16 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl shadow-lg overflow-hidden">
        <div>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          {product.thumbnails?.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.thumbnails.map((thumb, i) => (
                <button key={i} onClick={() => setMainImage(thumb)}>
                  <img
                    src={thumb}
                    alt={`${product.name} thumb ${i + 1}`}
                    className="w-full h-20 object-cover rounded-md border-2 border-transparent hover:border-yellow-500 transition"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-yellow-600">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="line-through text-gray-500 ml-3">${product.oldPrice.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center mb-6">
              <span className="mr-2 font-medium">Qty:</span>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 px-2 py-1 border rounded-md focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-full transition"
            >
              Add to Cart
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition">
              Add to Wishlist
            </button>
            <div className="text-gray-600 text-sm">
              <div><strong>SKU:</strong> {product.sku}</div>
              <div><strong>Category:</strong> {product.category}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
