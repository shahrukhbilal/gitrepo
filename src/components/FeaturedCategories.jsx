import React, { useEffect, useState } from 'react';

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/featured-categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error loading featured categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-10 px-4 sm:px-8 md:px-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Featured Categories</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <a href={`/category/${cat.slug}`} className="block text-center">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold text-gray-700">{cat.name}</h3>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
