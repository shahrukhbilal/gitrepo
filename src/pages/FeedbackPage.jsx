import React from 'react';
import { Link } from 'react-router-dom';

const FeedbackPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 text-center px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Thank You!</h1>
        <p className="text-gray-700 text-lg mb-6">
          Your message has been received. We appreciate your feedback and will get back to you soon.
        </p>

        <Link to="/" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default FeedbackPage;
