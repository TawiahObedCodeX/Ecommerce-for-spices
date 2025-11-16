// Updated ClientTrackOrder.jsx - Fixed to handle no orderId param (e.g., direct nav from navbar), loads from 'completedOrder' if no ID, auto-redirects if ID missing. Uses 'orders' array as fallback. Clears notification on load.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTruck, FiMapPin, FiClock, FiCheckCircle, FiX, FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

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
  const { orderId } = useParams(); // From route /trackmyorder/:orderId
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(1); // Start at 'in_progress'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = () => {
      let storedOrder = null;
      if (orderId) {
        // Load from 'orders' array by ID
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        storedOrder = orders.find(o => o.id === orderId);
      } else {
        // Fallback to 'completedOrder' if no ID
        storedOrder = JSON.parse(localStorage.getItem('completedOrder') || '{}');
        if (storedOrder.id && Object.keys(storedOrder).length > 0) {
          // Auto-redirect to full URL
          navigate(`/dashbord-client/trackmyorder/${storedOrder.id}`);
          setLoading(true);
          return;
        }
      }
      if (storedOrder && Object.keys(storedOrder).length > 0) {
        setCurrentOrder(storedOrder);
        // Clear notification after viewing
        localStorage.removeItem('completedOrder');
        window.dispatchEvent(new CustomEvent('orderCompleted', { detail: { cleared: true } })); // For navbar
      }
      setLoading(false);
    };
    loadOrder();
  }, [orderId, navigate]);

  useEffect(() => {
    if (!currentOrder || loading) return;
    // Simulate real-time progress (Bolt-like: advances every 10s)
    const interval = setInterval(() => {
      if (currentPosition < currentOrder.trackingPoints.length - 1) {
        setCurrentPosition(prev => prev + 1);
        // Update status
        setCurrentOrder(prev => ({
          ...prev,
          trackingPoints: prev.trackingPoints.map((point, idx) => ({
            ...point,
            status: idx < currentPosition ? 'completed' : idx === currentPosition ? 'in_progress' : 'pending'
          }))
        }));
      } else {
        clearInterval(interval);
      }
    }, 10000); // Demo: 10s intervals

    return () => clearInterval(interval);
  }, [currentPosition, currentOrder, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your spice journey...</p>
        </div>
      </div>
    );
  }

  if (!currentOrder || Object.keys(currentOrder).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Active Orders</h1>
          <p className="text-gray-600 mb-6">Place an order to start tracking your spices!</p>
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
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-8 px-4">
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
                animate={{ opacity: point.status === 'completed' ? 1 : (point.status === 'in_progress' ? 0.8 : 0.5) }}
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

        {/* Live Map Simulation - Simple SVG with animated path and dot (Bolt-like GPS) */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Live Tracking Map</h2>
          <p className="text-sm text-gray-600 mb-4">Your spices are en route – watch them spice up your day! (GPS simulation)</p>
          <div className="relative h-64 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
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
              {/* Animated truck/dot along path (progress based on currentPosition) */}
              <motion.circle
                cx={50 + (currentPosition / (currentOrder.trackingPoints.length - 1)) * 300}
                cy={200 - (currentPosition / (currentOrder.trackingPoints.length - 1)) * 80}
                r="8"
                fill="#fb923c"
                animate={{
                  cx: [50, 350],
                  cy: [200, 120],
                  pathLength: currentPosition / (currentOrder.trackingPoints.length - 1),
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
                  values="8;10;8"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </motion.circle>
              {/* Landmarks */}
              {currentOrder.trackingPoints.map((point, index) => (
                <g key={index}>
                  <circle cx={50 + (index / (currentOrder.trackingPoints.length - 1)) * 300} cy={200 - (index / (currentOrder.trackingPoints.length - 1)) * 80} r="6" fill={point.status === 'completed' ? '#10b981' : (point.status === 'in_progress' ? '#fb923c' : '#6b7280')} />
                  <text x={50 + (index / (currentOrder.trackingPoints.length - 1)) * 300 + 10} y={200 - (index / (currentOrder.trackingPoints.length - 1)) * 80 + 5} fontSize="10" fill="gray">{point.name.slice(0,3)}</text>
                </g>
              ))}
            </svg>
            {/* Overlay info */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-xs">
              Current: {currentOrder.trackingPoints[currentPosition].name} – ETA {currentOrder.trackingPoints[currentPosition].time}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Powered by GPS – Real-time updates every 10s</p>
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