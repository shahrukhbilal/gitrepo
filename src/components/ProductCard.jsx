import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice'; // ✅ Important: import the action
import { ShoppingCart } from 'lucide-react';   // or any Lucide cart icon

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <div className="border rounded-xl p-4 hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="mt-2 text-lg font-bold">{product.name}</h3>
      <p className="text-gray-600">{product.category}</p>
      <p className="text-xl font-semibold text-green-600">Rs. {product.price}</p>

      {product.stock === 0 ? (
        <button
          disabled
          className="w-full bg-gray-400 text-white font-semibold py-2 rounded-full cursor-not-allowed"
        >
          Out of Stock
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-full flex justify-center items-center gap-2"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
