import React, { useEffect, useState } from 'react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/contact') // 👈 hit the backend route
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error('Error fetching messages:', err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📩 Contact Messages</h2>

      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white shadow-lg rounded-xl p-4 border border-gray-200"
            >
              <h3 className="text-lg font-bold">{msg.name}</h3>
              <p className="text-sm text-gray-600">{msg.email}</p>
              <p className="my-2">{msg.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
