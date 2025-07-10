import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const MainNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // 🔁 Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      {/* Container */}
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Brand */}
        <h2 className="text-xl font-bold text-gray-800">Categories</h2>

        {/* Hamburger icon (mobile only) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-lg font-semibold text-gray-700">
          {categories.map((cat) => (
            <li key={cat._id}>
              <a href={`/category/${cat.slug}`} className="hover:text-blue-600">
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <ul className="md:hidden mt-3 space-y-2 text-center text-base font-semibold text-gray-700">
          {categories.map((cat) => (
            <li key={cat._id}>
              <a href={`/category/${cat.slug}`} className="block hover:text-blue-600">
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default MainNavbar;
