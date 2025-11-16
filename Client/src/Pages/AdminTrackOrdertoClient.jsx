// New AdminTrackOrdertoClient.jsx - Standout UI similar to Bolt: Sidebar list of orders, main tracking map/progress for selected order. Loads from 'orders' localStorage. Animated cards, real-time simulation, spice-themed gradients. Clients love the smooth GPS animation and vibrant colors – shareable vibes!
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTruck, FiMapPin, FiClock, FiCheckCircle, FiX, FiArrowLeft, FiUser, FiPackage, FiStar } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const sidebarVariants = {
  hidden: { x: -300 },
  visible: {
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function AdminTrackOrdertoClient() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    // Auto-select latest if none selected
    if (storedOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(storedOrders[0]);
      setCurrentPosition(1);
    }
  }, []);

  useEffect(() => {
    if (!selectedOrder) return;
    // Simulate progress for selected order
    const interval = setInterval(() => {
      if (currentPosition < selectedOrder.trackingPoints.length - 1) {
        setCurrentPosition(prev => prev + 1);
        setSelectedOrder(prev => ({
          ...prev,
          trackingPoints: prev.trackingPoints.map((point, idx) => ({
            ...point,
            status: idx < currentPosition ? 'completed' : idx === currentPosition ? 'in_progress' : 'pending'
          }))
        }));
      }
    }, 8000); // Faster for admin demo
    return () => clearInterval(interval);
  }, [currentPosition, selectedOrder]);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setCurrentPosition(1); // Reset progress
    setIsSidebarOpen(false); // Close on mobile
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4 max-w-md"
        >
          <FiPackage className="mx-auto text-8xl text-orange-400 mb-6 " />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">No Deliveries Yet</h1>
          <p className="text-xl text-gray-600 mb-8">Awaiting the first spice shipment. Clients are hungry for flavor!</p>
          <p className="text-sm text-gray-500">Pro tip: Share this tracking magic – friends will rave about the real-time GPS glow.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-red-50 to-orange-50 py-4 px-2 sm:px-4">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-3 shadow-lg"
      >
        <FiPackage size={20} className="text-orange-500" />
      </button>

      {/* Sidebar - Orders List */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate={isSidebarOpen ? "visible" : "hidden"}
        className="fixed md:static left-0 top-0 h-full w-80 bg-white shadow-2xl z-40 overflow-y-auto md:translate-x-0 transform transition-transform duration-300"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
            <FiTruck className="mr-2 text-orange-500" />
            Active Deliveries ({orders.length})
          </h2>
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <AnimatePresence>
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => handleSelectOrder(order)}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                    selectedOrder?.id === order.id
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">#{order.id.slice(-6)}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{order.client}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">¢{order.total.toFixed(2)}</span>
                    <div className="flex items-center space-x-1">
                      {order.items.slice(0, 2).map((item, i) => (
                        <FiStar key={i} className="w-3 h-3 text-orange-500 fill-current" />
                      ))}
                      {order.items.length > 2 && <span className="text-xs text-gray-500">+{order.items.length - 2}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="md:ml-80">
        {selectedOrder ? (
          <>
            {/* Header */}
            <motion.header
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between mb-8 p-4 bg-white rounded-2xl shadow-lg"
            >
              <button
                onClick={() => navigate('/dashboard-admin')} // Navigate to admin dashboard
                className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
              >
                <FiArrowLeft size={20} />
                <span>Admin Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Tracking #{selectedOrder.id}</h1>
              <FiUser size={24} className="text-gray-500" />
            </motion.header>

            {/* Order Summary */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 mx-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <FiPackage className="mr-2 text-orange-500" />
                Shipment to {selectedOrder.client}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 rounded-xl">
                    <img src={item.image || 'https://via.placeholder.com/40?text=S'} alt={item.name} className="w-8 h-8 rounded object-cover" />
                    <span className="text-gray-700 truncate flex-1">{item.name}</span>
                    <span className="font-semibold text-orange-600">x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-orange-600">¢{selectedOrder.total.toFixed(2)}</span>
              </div>
            </motion.div>

            {/* Progress & Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-4">
              {/* Progress Steps */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                  <FiClock className="mr-2 text-orange-500" />
                  Delivery Stages
                </h3>
                <div className="space-y-4">
                  {selectedOrder.trackingPoints.map((point, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: point.status === 'completed' ? 1 : (point.status === 'in_progress' ? 0.8 : 0.5) }}
                      className="relative flex items-center space-x-4 group"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        point.status === 'completed' ? 'bg-green-500 text-white shadow-lg' :
                        point.status === 'in_progress' ? 'bg-orange-500 text-white shadow-lg animate-pulse' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {point.status === 'completed' ? <FiCheckCircle size={16} /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{point.name}</p>
                        <p className="text-sm text-gray-600">{point.time}</p>
                      </div>
                      {/* Connecting line */}
                      {index < selectedOrder.trackingPoints.length - 1 && (
                        <div className={`absolute left-5 top-12 w-0.5 h-12 ${
                          point.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-sm text-emerald-800 flex items-center font-medium">
                    <FiMapPin className="mr-2" />
                    ETA: {selectedOrder.estimatedDelivery} – On track! 🚀
                  </p>
                </div>
              </motion.div>

              {/* Live Map */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <FiMapPin className="mr-2 text-orange-500" />
                  GPS Live Track (Accra Routes)
                </h3>
                <p className="text-sm text-gray-600 mb-4">Watch the delivery dash – clients share this view for that "wow" factor!</p>
                <div className="relative h-64 bg-linear-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden border border-blue-200">
                  <svg viewBox="0 0 400 250" className="w-full h-full">
                    <path
                      d="M 50 200 Q 150 150 250 100 Q 300 80 350 120"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                    />
                    <motion.circle
                      cx={50 + (currentPosition / (selectedOrder.trackingPoints.length - 1)) * 300}
                      cy={200 - (currentPosition / (selectedOrder.trackingPoints.length - 1)) * 80}
                      r="10"
                      fill="#f97316"
                      className="drop-shadow-lg"
                      animate={{
                        cx: [50, 350],
                        cy: [200, 120],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 25,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0.5;1"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </motion.circle>
                    {selectedOrder.trackingPoints.map((point, index) => (
                      <g key={index}>
                        <circle 
                          cx={50 + (index / (selectedOrder.trackingPoints.length - 1)) * 300} 
                          cy={200 - (index / (selectedOrder.trackingPoints.length - 1)) * 80} 
                          r="8" 
                          fill={point.status === 'completed' ? '#10b981' : (point.status === 'in_progress' ? '#f97316' : '#9ca3af')} 
                          className="drop-shadow-md"
                        />
                        <text 
                          x={50 + (index / (selectedOrder.trackingPoints.length - 1)) * 300 + 15} 
                          y={200 - (index / (selectedOrder.trackingPoints.length - 1)) * 80 + 4} 
                          fontSize="11" 
                          fill="#374151" 
                          fontWeight="bold"
                        >
                          {point.name.slice(0,4)}
                        </text>
                      </g>
                    ))}
                  </svg>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                    <p className="text-xs font-bold text-gray-800">Delivery Van</p>
                    <p className="text-xs text-orange-600 flex items-center">
                      <FiTruck className="mr-1 w-3 h-3" />
                      En route to {selectedOrder.client.slice(0,10)}...
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">Mock GPS – Integrates with Google Maps API for live client sharing</p>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 mx-4"
          >
            <FiTruck className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Select a Delivery</h2>
            <p className="text-gray-500">Click an order from the sidebar to track its spicy journey.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}