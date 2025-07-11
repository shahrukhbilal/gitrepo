import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const ContactPage = () => {
  const navigate= useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
          navigate('/feedback')
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <section className="bg-yellow-400 text-black py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="max-w-xl mx-auto text-lg">
          Have questions, feedback, or just want to say hello? We'd love to hear from you.
        </p>
      </section>

      {/* Contact Info + Form */}
      <section className="max-w-7xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Contact Information</h2>
          <p className="text-gray-600">
            Feel free to reach us using the details below or fill the form.
          </p>

          <div>
            <h4 className="font-bold text-sm">📍 Address</h4>
            <p className="text-gray-600">
              Navy Housing Society, National Stadium Road, Karachi
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm">📞 Phone</h4>
            <p className="text-gray-600">+92 318 6198386</p>
          </div>

          <div>
            <h4 className="font-bold text-sm">✉️ Email</h4>
            <p className="text-gray-600">support@myshop.com</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Write your message..."
                required
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 transition-colors text-black font-semibold py-2 px-6 rounded-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Optional Google Map Embed */}
      <section className="mt-10">
        <iframe
          title="Google Map"
          className="w-full h-64 border-0"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.570775014072!2d67.07104921498889!3d24.86073468405485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f966f5b5b91%3A0x6dfd0247ac9f0072!2sNational%20Stadium%20Road%2C%20Karachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1624022445484!5m2!1sen!2s"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};

export default ContactPage;
