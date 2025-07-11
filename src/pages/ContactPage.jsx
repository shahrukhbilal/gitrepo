import React from 'react';

const ContactPage = () => {
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
          <p className="text-gray-600">Feel free to reach us using the details below or fill the form.</p>

          <div>
            <h4 className="font-bold text-sm">📍 Address</h4>
            <p className="text-gray-600">Navy Housing Society, National Stadium Road, Karachi</p>
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
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows="4"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Write your message..."
              ></textarea>
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
