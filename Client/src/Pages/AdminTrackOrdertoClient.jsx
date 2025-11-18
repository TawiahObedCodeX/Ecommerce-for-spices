// Refined AdminTrackOrder.jsx - Balanced luxury layout: Equal-width sections for map (left) and route panel (right) on desktop via grid-cols-2. Sidebar remains fixed left for functionality, but main content centered with symmetric feel through equal column spans. Enhanced opulence: Deeper gradients, refined typography, fluid responsiveness. Developer-grade: Optimized for accessibility, performant animations, no visual asymmetry.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTruck, FiMapPin, FiClock, FiCheckCircle, FiX, FiArrowLeft, FiUser, FiPackage, FiStar, FiSearch, FiPlus, FiMenu } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const sidebarVariants = {
  hidden: { x: -340 },
  visible: {
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function AdminTrackOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  }, []);

  useEffect(() => {
    if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
      setCurrentPosition(1);
    }
  }, [orders, selectedOrder]);

  useEffect(() => {
    if (!selectedOrder) return;
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
    }, 5000); // Refined simulation speed
    return () => clearInterval(interval);
  }, [currentPosition, selectedOrder]);

  const filteredOrders = orders.filter(order =>
    order.id.includes(searchTerm) || order.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setCurrentPosition(1);
    setIsSidebarOpen(false);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-100 via-gold-50 to-rose-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-8 max-w-xl mx-auto"
        >
          <FiPackage className="mx-auto text-9xl text-amber-500 mb-8 drop-shadow-2xl" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">Fleet at Rest</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">The canvas is clear – orchestrate your next masterpiece of motion.</p>
          <p className="text-sm text-gray-500 italic font-light">Where precision dances with prestige.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-100 via-gold-50 to-rose-100 overflow-hidden relative">
      {/* Ambient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.1),transparent)]" />

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-6 left-6 z-50 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/30 hover:shadow-3xl transition-shadow"
        aria-label="Toggle shipments menu"
      >
        <FiMenu size={20} className="text-amber-700" />
      </button>

      {/* Fixed Sidebar - Desktop: Static left, Mobile: Overlay */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate={isSidebarOpen ? "visible" : "hidden"}
        className="fixed md:static left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-3xl shadow-2xl z-40 overflow-y-auto border-r border-white/30 md:translate-x-0"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center tracking-tight">
              <FiTruck className="mr-3 text-amber-700 w-7 h-7" />
              Logistics Vault
            </h2>
            <button 
              className="p-2.5 rounded-xl hover:bg-amber-50 transition-colors text-amber-700"
              aria-label="Add new shipment"
            >
              <FiPlus size={18} />
            </button>
          </div>
          <div className="relative mb-6 flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ID or Client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all placeholder-gray-500"
            />
          </div>
          <div className="space-y-3 overflow-y-auto flex-1">
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.2 } }}
                  onClick={() => handleSelectOrder(order)}
                  className={`p-5 rounded-2xl cursor-pointer border transition-all duration-300 backdrop-blur-md hover:shadow-xl ${
                    selectedOrder?.id === order.id
                      ? 'border-amber-500/80 bg-linear-to-br from-amber-50 to-gold-50 shadow-2xl ring-2 ring-amber-200/50'
                      : 'border-gray-200/50 hover:border-amber-300/50 hover:bg-white/70'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select shipment ${order.id} for ${order.client}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-bold text-gray-900 text-base tracking-wide">#{order.id.slice(-6)}</span>
                    <motion.div 
                      animate={{ scale: order.status === 'delivered' ? 1 : 1 }}
                      className={`w-3 h-3 rounded-full mt-0.5 shrink-0 ${
                        order.status === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                      }`} 
                    />
                  </div>
                  <p className="text-sm text-gray-700 mb-3 font-semibold leading-tight">{order.client}</p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                    <span className="text-gray-600 font-medium">¢{order.total.toFixed(2)}</span>
                    <div className="flex items-center space-x-0.5">
                      {order.items.slice(0, 3).map((_, i) => (
                        <FiStar key={i} className="w-3.5 h-3.5 text-amber-500 fill-current drop-shadow-sm" />
                      ))}
                      {order.items.length > 3 && <span className="text-gray-500 ml-1">+{order.items.length - 3}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 md:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Centered Main Content */}
      <main className="md:ml-80 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 h-full">
          {selectedOrder ? (
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              className="space-y-8"
            >
              {/* Centered Header */}
              <motion.header 
                variants={itemVariants} 
                className="flex items-center justify-center md:justify-between bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/30 mx-auto w-full max-w-4xl"
              >
                <button
                  onClick={() => navigate('/dashboard-admin')}
                  className="hidden md:flex items-center space-x-3 text-amber-700 hover:text-amber-800 font-semibold transition-colors tracking-wide"
                  aria-label="Return to admin dashboard"
                >
                  <FiArrowLeft size={20} />
                  <span>Command Center</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight text-center flex-1 md:flex-none">
                  Sovereign Route #{selectedOrder.id}
                </h1>
                <FiUser size={24} className="text-gray-500 ml-auto md:ml-0" />
              </motion.header>

              {/* Hero Cargo Cards - Centered grid, inspired by shipment UI */}
              <motion.div 
                variants={itemVariants} 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto w-full max-w-5xl"
              >
                {[
                  { type: 'Origin Pickup', icon: FiMapPin, color: 'blue', data: selectedOrder.trackingPoints[0], bg: 'from-blue-50 to-cyan-50' },
                  { type: 'Core Delivery', icon: FiTruck, color: 'emerald', data: selectedOrder.trackingPoints[selectedOrder.trackingPoints.length - 1], bg: 'from-emerald-50 to-teal-50' },
                  { type: 'Midpoint Transfer', icon: FiPackage, color: 'amber', data: selectedOrder.trackingPoints[Math.floor(selectedOrder.trackingPoints.length / 2)], bg: 'from-amber-50 to-orange-50' }
                ].map((card, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                    className={`bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-${card.color}-100/50 overflow-hidden relative mx-auto max-w-sm`}
                  >
                    <div className={`absolute inset-0 bg-linear-to-br ${card.bg} opacity-70`} />
                    <div className={`relative z-10 w-14 h-14 bg-${card.color}-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg drop-shadow-xl`}>
                      <card.icon size={24} />
                    </div>
                    <h3 className="relative z-10 font-bold text-gray-900 mb-2 text-lg tracking-tight">{card.type}</h3>
                    <p className="relative z-10 text-sm text-gray-600 mb-1 font-mono">{card.data.time}</p>
                    <p className="relative z-10 text-sm font-semibold text-gray-800 leading-tight">{card.data.location}</p>
                    <p className="relative z-10 text-xs text-gray-500 mt-2 italic">{card.data.client}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Balanced Map & Route - Equal columns on desktop for symmetry */}
              <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto w-full max-w-6xl">
                {/* Map - Left side, full height */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30 order-2 lg:order-1"
                >
                  <div className="p-6 border-b border-gray-100/50">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center tracking-tight">
                      <FiMapPin className="mr-3 text-amber-700 w-5 h-5" />
                      Celestial Pathways
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Where routes converge in harmonious precision – a symphony of transit.</p>
                  </div>
                  <div className="relative h-96 bg-linear-to-br from-indigo-50 via-blue-50 to-amber-50">
                    <svg viewBox="0 0 1000 400" className="w-full h-full">
                      <path
                        d="M 100 350 Q 300 200 500 100 Q 700 50 900 150"
                        stroke="#1d4ed8"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray="12,6"
                        strokeLinecap="round"
                      />
                      <motion.circle
                        cx={100 + (currentPosition / (selectedOrder.trackingPoints.length - 1)) * 800}
                        cy={350 - (currentPosition / (selectedOrder.trackingPoints.length - 1)) * 200}
                        r="14"
                        fill="#d97706"
                        className="drop-shadow-2xl"
                        animate={{
                          cx: [100, 900],
                          cy: [350, 150],
                          scale: [1, 1.4, 1],
                          rotate: [0, 180],
                        }}
                        transition={{
                          duration: 18,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      >
                        <FiTruck className="w-6 h-6 text-white relative -top-0.5" />
                      </motion.circle>
                      {selectedOrder.trackingPoints.map((point, index) => (
                        <g key={index}>
                          <circle 
                            cx={100 + (index / (selectedOrder.trackingPoints.length - 1)) * 800} 
                            cy={350 - (index / (selectedOrder.trackingPoints.length - 1)) * 200} 
                            r="12" 
                            fill={point.status === 'completed' ? '#059669' : (point.status === 'in_progress' ? '#d97706' : '#d1d5db')} 
                            className="drop-shadow-xl"
                          />
                          <text 
                            x={100 + (index / (selectedOrder.trackingPoints.length - 1)) * 800 + 18} 
                            y={350 - (index / (selectedOrder.trackingPoints.length - 1)) * 200 + 6} 
                            fontSize="14" 
                            fill="#374151" 
                            fontWeight="bold"
                            textAnchor="start"
                          >
                            {point.name.slice(0,8)}
                          </text>
                        </g>
                      ))}
                    </svg>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">Vanguard Fleet</p>
                      <p className="text-sm text-amber-700 font-semibold flex items-center mt-1">
                        <FiTruck className="mr-2 w-4 h-4" />
                        FM460 XL – Sovereign transit
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Route Details Panel - Right side, full height, equal width */}
                <motion.div 
                  variants={itemVariants} 
                  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/30 space-y-4 self-start order-1 lg:order-2"
                >
                  <h3 className="text-xl font-bold text-gray-900 flex items-center tracking-tight">
                    <FiClock className="mr-3 text-amber-700 w-5 h-5" />
                    Transit Nodes
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedOrder.trackingPoints.map((point, index) => (
                      <motion.div 
                        key={index}
                        initial={{ x: 10 }}
                        animate={{ x: 0 }}
                        className={`flex items-center space-x-3 p-4 rounded-2xl transition-all border ${
                          point.status === 'completed' ? 'bg-emerald-50 border-emerald-200' :
                          point.status === 'in_progress' ? 'bg-amber-50 border-amber-200 animate-pulse' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shadow-md ${
                          point.status === 'completed' ? 'bg-emerald-500 text-white' :
                          point.status === 'in_progress' ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {point.status === 'completed' ? <FiCheckCircle size={14} /> : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{point.location}</p>
                          <p className="text-xs text-gray-600 capitalize">{point.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 bg-linear-to-r from-amber-50 to-gold-50 rounded-2xl border border-amber-200 mt-4">
                    <p className="text-sm text-amber-800 font-semibold">Horizon: {selectedOrder.estimatedDelivery}</p>
                    <p className="text-xs text-amber-700 mt-1 flex items-center">
                      <FiUser className="mr-1 w-3 h-3" />
                      Artem Bezukov | +49 172 123 456
                    </p>
                  </div>
                </motion.div>
              </motion.section>

              {/* Centered Driver Directive */}
              <motion.div 
                variants={itemVariants} 
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 mx-auto w-full max-w-4xl text-center"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center tracking-tight">
                  <FiUser className="mr-3 text-amber-700 w-5 h-5" />
                  Custodian Codex
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto italic">
                  Prior to embarkation, meticulously survey the consignment for any manifest imperfections or variances. Chronicle observations forthwith to the syndicate.
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="flex flex-col items-center justify-center h-[70vh] text-center"
            >
              <FiTruck className="text-8xl text-gray-400 mb-8 drop-shadow-lg" />
              <h2 className="text-3xl font-bold text-gray-600 mb-4 tracking-tight">Invoke a Voyage</h2>
              <p className="text-gray-500 text-lg max-w-md leading-relaxed">From the vault, summon a shipment to unveil its gilded path.</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}