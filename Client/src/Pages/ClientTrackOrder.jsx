// New ClientTrackOrder.jsx - Simulated live map with animated delivery truck/dot on a simple SVG map, progress steps, estimated time, and order details
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTruck, FiMapPin, FiClock, FiCheckCircle, FiX, FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const mockOrder = {
  id: 'SPICE-12345',
  items: [
    { name: 'Fiery Chili Powder', quantity: 2, price: 25.00 },
    { name: 'Cumin Blend', quantity: 1, price: 18.00 }
  ],
  total: 68.00,
  status: 'in_transit', // 'preparing', 'in_transit', 'out_for_delivery', 'delivered'
  estimatedDelivery: 'Today, 6:00 PM',
  trackingPoints: [
    { lat: 5.6037, lng: -0.1870, name: 'Warehouse', status: 'completed', time: '10:00 AM' },
    { lat: 5.6100, lng: -0.2000, name: 'Sorting Hub', status: 'completed', time: '11:30 AM' },
    { lat: 5.6200, lng: -0.2100, name: 'Local Depot', status: 'in_progress', time: '1:00 PM' },
    { lat: 5.6300, lng: -0.2200, name: 'Your Doorstep', status: 'pending', time: '6:00 PM' }
  ]
};

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
    transition: { duration: 0.5 },
  },
};

export default function ClientTrackOrder() {
  const navigate = useNavigate();
  const { orderId: _orderId } = useParams(); // Assume route has /trackmyorder/:orderId
  const currentOrder = mockOrder;
  const [currentPosition, setCurrentPosition] = useState(2); // Index of current tracking point

  useEffect(() => {
    // Simulate real-time progress
    const interval = setInterval(() => {
      if (currentPosition < currentOrder.trackingPoints.length - 1) {
        setCurrentPosition(prev => prev + 1);
      } else {
        clearInterval(interval);
      }
    }, 10000); // Update every 10s for demo

    return () => clearInterval(interval);
  }, [currentPosition, currentOrder.trackingPoints.length]);

  if (!currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <button 
            onClick={() => navigate('/dashbord-client')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-8"
        >
          <button 
            onClick={() => navigate('/dashbord-client')}
            className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            <FiArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Track Order #{currentOrder.id}</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </motion.div>

        {/* Order Summary Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Order Details</h2>
          <div className="space-y-3">
            {currentOrder.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                <span className="font-semibold text-orange-600">¢{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>¢{currentOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <FiTruck className="mr-2 text-orange-500" />
            Delivery Progress
          </h2>
          <div className="space-y-4">
            {currentOrder.trackingPoints.map((point, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: point.status === 'completed' ? 1 : 0.5 }}
                className="flex items-center space-x-4"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  point.status === 'completed' ? 'bg-green-500 text-white' :
                  point.status === 'in_progress' ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {point.status === 'completed' ? <FiCheckCircle size={16} /> : index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{point.name}</p>
                  <p className="text-sm text-gray-600">{point.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800 flex items-center">
              <FiClock className="mr-2" />
              Estimated Arrival: {currentOrder.estimatedDelivery}
            </p>
          </div>
        </motion.div>

        {/* Live Map Simulation - Simple SVG with animated path and dot */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Live Tracking Map</h2>
          <p className="text-sm text-gray-600 mb-4">Your spices are en route – watch them spice up your day!</p>
          <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
            {/* Simple SVG Map of Accra area (mock coordinates scaled) */}
            <svg viewBox="0 0 400 250" className="w-full h-full">
              {/* Path from warehouse to depot */}
              <path
                d="M 50 200 Q 150 150 250 100 Q 300 80 350 120"
                stroke="#e5e7eb"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
              />
              {/* Animated truck/dot along path */}
              <motion.circle
                cx={currentPosition * 80 + 50}
                cy={200 - currentPosition * 30}
                r="6"
                fill="#fb923c"
                animate={{
                  cx: [50, 350],
                  cy: [200, 120],
                  pathLength: 1,
                }}
                transition={{
                  duration: 30, // Full trip in 30s for demo
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <animate
                  attributeName="r"
                  values="6;8;6"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </motion.circle>
              {/* Landmarks */}
              {currentOrder.trackingPoints.map((point, index) => (
                <g key={index}>
                  <circle cx={index * 100 + 50} cy={200 - index * 40} r="4" fill={point.status === 'completed' ? '#10b981' : '#6b7280'} />
                  <text x={index * 100 + 60} y={200 - index * 40 + 5} fontSize="10" fill="gray">{point.name.slice(0,3)}</text>
                </g>
              ))}
            </svg>
            {/* Overlay info */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-xs">
              Current: {currentOrder.trackingPoints[currentPosition].name} – ETA {currentOrder.trackingPoints[currentPosition].time}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Map simulation – in real app, powered by GPS</p>
        </motion.div>

        {/* Support */}
        <motion.div variants={itemVariants} className="text-center py-8">
          <p className="text-gray-600 mb-4">Need help? We're here 24/7.</p>
          <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
}