import React, { useState, useEffect } from 'react';
import Loading from '../Components/Loading';

const mockMessages = [
  {
    id: 1,
    clientName: 'Ama Mensah',
    orderId: '#ORD-2025-001',
    product: 'Jollof Spice Blend',
    quantity: 2,
    message: 'Please confirm my order for the Jollof spices. Excited to try it!',
    timestamp: '2025-11-10 10:30 AM',
    status: 'new',
    avatar: 'https://i.pinimg.com/1200x/b1/2b/b9/b12bb97ba6225f77a0dc315cdda2b61a.jpg'
  },
  {
    id: 2,
    clientName: 'Kwame Osei',
    orderId: '#ORD-2025-002',
    product: 'Berbere Powder',
    quantity: 1,
    message: 'Need this shipped urgently for a family gathering.',
    timestamp: '2025-11-10 09:45 AM',
    status: 'read',
    avatar: 'https://i.pinimg.com/1200x/2e/40/e7/2e40e7bf228ec13f6742ffc4bf945051.jpg'
  },
  {
    id: 3,
    clientName: 'Efua Addo',
    orderId: '#ORD-2025-003',
    product: 'Garam Masala Mix',
    quantity: 3,
    message: 'Great quality last time! Ordering more.',
    timestamp: '2025-11-09 03:20 PM',
    status: 'new',
    avatar: 'https://i.pinimg.com/1200x/59/a4/ac/59a4ac19ab9cabb7218ea492d71d79eb.jpg'
  }
];

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Simulate loading delay for realism
    const timer = setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 800);

    // TODO: Replace with actual backend fetch
    // fetch('/api/admin/messages')
    //   .then(res => res.json())
    //   .then(data => {
    //     setMessages(data);
    //     setLoading(false);
    //   })
    //   .catch(err => console.error(err));

    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, status: 'read' } : msg
    ));

    // TODO: Update backend
    // fetch(`/api/admin/messages/${id}/read`, { method: 'PATCH' });
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));

    // TODO: Delete from backend
    // fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
  };

  const deleteAllMessages = () => {
    setMessages([]);

    // TODO: Delete all from backend
    // fetch('/api/admin/messages', { method: 'DELETE' });
  };



  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className={`transition-all duration-700 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Order Notifications
            </h1>
            <p className="text-gray-600">
              Stay updated with new orders and customer messages.
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={deleteAllMessages}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              Delete All ({messages.length})
            </button>
          )}
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`
                bg-white rounded-lg shadow-md border 
                ${message.status === 'new' ? 'border-blue-500' : 'border-gray-200'}
                hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5
                ${mounted ? `transition-all duration-500 ease-out delay-${index * 100}ms opacity-100 translate-x-0` : 'opacity-0 translate-x-5'}
              `}
            >
              <div className="p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Avatar and Details */}
                <div className="flex items-start space-x-4 flex-1">
                  <img
                    src={message.avatar}
                    alt={message.clientName}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 shrink-0 transition-transform duration-200 hover:scale-105"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {message.clientName}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {message.status === 'new' ? 'New' : 'Read'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Order: {message.orderId}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      {message.product} × {message.quantity}
                    </p>
                    <p className="text-sm text-gray-700">"{message.message}"</p>
                    <p className="text-xs text-gray-400 mt-2">{message.timestamp}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 self-start">
                  {message.status === 'new' && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md font-medium hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md font-medium hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State if no messages */}
        {messages.length === 0 && (
          <div className={`text-center py-12 transition-all duration-700 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <span className="text-2xl">📨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No messages</h3>
            <p className="text-gray-500">Check back soon for order updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}