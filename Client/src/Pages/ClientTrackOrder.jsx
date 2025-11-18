// Enhanced ClientTrackOrder.jsx - Luxury single-order tracker for clients. Inspired by image: Centered map with integrated route stops, elegant progress timeline, cargo summary with subtle luxury cards. Responsive: Stacked on mobile, side-by-side on desktop. Smooth animations, warm gradients for premium feel. Auto-loads order, real-time GPS dot with truck icon. Pro touches: Backdrop blurs, micro-animations, accessible contrasts.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTruck, FiMapPin, FiClock, FiCheckCircle, FiX, FiArrowLeft, FiPackage } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ClientTrackOrder() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = () => {
      let storedOrder = null;
      if (orderId) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        storedOrder = orders.find(o => o.id === orderId);
      } else {
        storedOrder = JSON.parse(localStorage.getItem('completedOrder') || '{}');
        if (storedOrder.id && Object.keys(storedOrder).length > 0) {
          navigate(`/dashbord-client/trackmyorder/${storedOrder.id}`);
          setLoading(true);
          return;
        }
      }
      if (storedOrder && Object.keys(storedOrder).length > 0) {
        setCurrentOrder(storedOrder);
        localStorage.removeItem('completedOrder');
        window.dispatchEvent(new CustomEvent('orderCompleted', { detail: { cleared: true } }));
      }
      setLoading(false);
    };
    loadOrder();
  }, [orderId, navigate]);

  useEffect(() => {
    if (!currentOrder || loading) return;
    const interval = setInterval(() => {
      if (currentPosition < currentOrder.trackingPoints.length - 1) {
        setCurrentPosition(prev => prev + 1);
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
    }, 8000); // Elegant pacing
    return () => clearInterval(interval);
  }, [currentPosition, currentOrder, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-rose-50">
        <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="relative">
          <FiTruck className="text-8xl text-amber-500 mx-auto" />
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
        </motion.div>
        <p className="text-gray-600 mt-6 text-lg">Tracing your exquisite shipment...</p>
      </div>
    );
  }

  if (!currentOrder || Object.keys(currentOrder).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-rose-50 px-4">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">No Journey in Motion</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">Craft your next order to embark on a track of unparalleled elegance.</p>
          <button 
            onClick={() => navigate('/dashbord-client')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Explore Collection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-8"
        >
          <button 
            onClick={() => navigate('/dashbord-client')}
            className="flex items-center space-x-3 text-amber-600 hover:text-amber-700 font-semibold transition-colors tracking-wide"
          >
            <FiArrowLeft size={20} />
            <span>Client Suite</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Journey #{currentOrder.id}</h1>
          <div className="w-24" /> {/* Alignment spacer */}
        </motion.div>

        {/* Cargo Summary - Luxury card with items */}
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 mb-8 border border-white/20 overflow-hidden">
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center tracking-tight">
            <FiPackage className="mr-3 text-amber-600" />
            Your Curated Selection
          </h2>
          <div className="space-y-4 mb-6">
            {currentOrder.items.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl border border-amber-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-amber-600 font-bold text-sm">{item.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">x{item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-amber-600 text-sm">¢{(item.price * item.quantity).toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between items-end">
            <span className="text-gray-600 font-medium">Grand Total</span>
            <span className="text-2xl font-bold text-amber-600 tracking-wide">¢{currentOrder.total.toFixed(2)}</span>
          </div>
        </motion.div>

        {/* Progress Timeline - Vertical on mobile, horizontal on desktop */}
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center tracking-tight">
            <FiClock className="mr-3 text-amber-600" />
            Voyage Milestones
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 to-rose-500 transform -translate-x-1/2 md:translate-x-0 hidden md:block" />
            <div className="space-y-6 md:space-y-0 md:space-x-8 md:flex md:justify-center">
              {currentOrder.trackingPoints.map((point, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ 
                    opacity: point.status === 'completed' ? 1 : (point.status === 'in_progress' ? 0.9 : 0.5), 
                    scale: point.status === 'in_progress' ? 1.05 : 1 
                  }}
                  className="flex items-center space-x-4 md:flex-col md:space-x-0 md:space-y-4 md:items-center relative"
                >
                  <div className={`w-12 h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all ${
                    point.status === 'completed' ? 'bg-emerald-500 text-white' :
                    point.status === 'in_progress' ? 'bg-amber-500 text-white animate-pulse' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {point.status === 'completed' ? <FiCheckCircle size={16} /> : index + 1}
                  </div>
                  <div className="flex-1 md:text-center">
                    <p className="font-medium text-gray-900">{point.name}</p>
                    <p className="text-sm text-gray-600">{point.time}</p>
                  </div>
                  {index < currentOrder.trackingPoints.length - 1 && (
                    <div className={`absolute left-full top-6 w-8 h-0.5 md:hidden ${
                      point.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-8 p-5 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-2xl border border-emerald-200">
            <p className="text-sm text-emerald-800 font-semibold flex items-center justify-center">
              <FiMapPin className="mr-2" />
              Anticipated Arrival: {currentOrder.estimatedDelivery} – Precision assured.
            </p>
          </div>
        </motion.div>

        {/* Integrated Map with Route - Centered luxury view */}
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/20 overflow-hidden">
          <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center tracking-tight">
            <FiMapPin className="mr-3 text-amber-600" />
            Live Odyssey Map
          </h2>
          <p className="text-sm text-gray-600 mb-6 italic">Witness the elegance of motion – your parcel's bespoke path unfolds.</p>
          <div className="relative h-80 bg-gradient-to-br from-blue-50 via-indigo-50 to-amber-50 rounded-2xl overflow-hidden">
            <svg viewBox="0 0 600 300" className="w-full h-full">
              <path
                d="M 80 250 Q 200 180 350 120 Q 450 90 520 150"
                stroke="#3b82f6"
                strokeWidth="4"
                fill="none"
                strokeDasharray="8,4"
                strokeLinecap="round"
              />
              <motion.g
                animate={{
                  pathLength: currentPosition / (currentOrder.trackingPoints.length - 1),
                }}
                transition={{
                  duration: 25,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <motion.circle
                  cx={80 + (currentPosition / (currentOrder.trackingPoints.length - 1)) * 440}
                  cy={250 - (currentPosition / (currentOrder.trackingPoints.length - 1)) * 100}
                  r="10"
                  fill="#f97316"
                  className="drop-shadow-xl"
                  animate={{
                    cx: [80, 520],
                    cy: [250, 150],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 25,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                >
                  <FiTruck className="w-5 h-5 text-white relative -top-0.5" />
                </motion.circle>
              </motion.g>
              {currentOrder.trackingPoints.map((point, index) => (
                <g key={index}>
                  <circle 
                    cx={80 + (index / (currentOrder.trackingPoints.length - 1)) * 440} 
                    cy={250 - (index / (currentOrder.trackingPoints.length - 1)) * 100} 
                    r="8" 
                    fill={point.status === 'completed' ? '#10b981' : (point.status === 'in_progress' ? '#f97316' : '#9ca3af')} 
                    className="drop-shadow-md"
                  />
                  <text 
                    x={80 + (index / (currentOrder.trackingPoints.length - 1)) * 440 + 12} 
                    y={250 - (index / (currentOrder.trackingPoints.length - 1)) * 100 + 4} 
                    fontSize="11" 
                    fill="#374151" 
                    fontWeight="bold"
                  >
                    {point.name.slice(0,5)}
                  </text>
                </g>
              ))}
            </svg>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl text-center">
              <p className="text-xs font-bold text-gray-900">Current Locale</p>
              <p className="text-sm text-amber-600 flex items-center justify-center mt-1">
                {currentOrder.trackingPoints[currentPosition].location} – {currentOrder.trackingPoints[currentPosition].time}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center italic">Orchestrated by premium GPS – Updates in serene intervals.</p>
        </motion.div>

        {/* Concierge */}
        <motion.div variants={itemVariants} className="text-center py-12">
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">Your voyage captivates – yet assistance is ever at hand.</p>
          <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all tracking-wide">
            Summon Concierge
          </button>
        </motion.div>
      </div>
    </div>
  );
}