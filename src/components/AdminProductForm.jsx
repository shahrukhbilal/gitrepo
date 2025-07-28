import React, { useState } from 'react';

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    images: [],
    sizes: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'title') {
      const generatedSlug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: generatedSlug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      sizes: e.target.checked
        ? [...prev.sizes, value]
        : prev.sizes.filter((size) => size !== value),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const uploadImagesToCloudinary = async () => {
    const urls = [];

    for (const file of selectedFiles) {
      const cloudForm = new FormData();
      cloudForm.append('file', file);
      cloudForm.append('upload_preset', 'ecommrece_unsigned');
      cloudForm.append('cloud_name', 'dvjkqt391');

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dvjkqt391/image/upload',
        { method: 'POST', body: cloudForm }
      );
      const data = await res.json();
      urls.push(data.secure_url);
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImages = await uploadImagesToCloudinary();

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: uploadedImages,
      };

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create product');

      alert('✅ Product created successfully!');

      setFormData({
        title: '',
        slug: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        images: [],
        sizes: [],
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded shadow-md max-w-2xl mx-auto"
    >
      <input
        type="text"
        name="title"
        placeholder="Product Title"
        className="w-full border px-4 py-2 rounded-md"
        value={formData.title}
        onChange={handleChange}
        required
      />

      {/* ✅ Category Dropdown */}
      <select
        name="category"
        className="w-full border px-4 py-2 rounded-md"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="electronics">Electronics</option>
        <option value="shoes">Shoes</option>
        <option value="accessories">Accessories</option>
      </select>

      <input
        type="number"
        name="price"
        placeholder="Price"
        className="w-full border px-4 py-2 rounded-md"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        className="w-full border px-4 py-2 rounded-md"
        value={formData.stock}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full border px-4 py-2 rounded-md"
        rows={4}
        value={formData.description}
        onChange={handleChange}
        required
      />

      {/* ✅ Sizes Selection */}
      <div className="flex gap-4">
        {['S', 'M', 'L', 'XL'].map((size) => (
          <label key={size} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={size}
              checked={formData.sizes.includes(size)}
              onChange={handleSizeChange}
            />
            {size}
          </label>
        ))}
      </div>

      {/* ✅ Image Upload */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border px-4 py-2 rounded-md"
        required
      />

      {/* ✅ Image Previews */}
      {previewUrls.length > 0 && (
        <div className="flex gap-4 flex-wrap mt-2">
          {previewUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Preview ${i}`}
              className="w-24 h-24 object-cover rounded border"
            />
          ))}
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Create Product'}
      </button>
    </form>
  );
};

export default AdminProductForm;
