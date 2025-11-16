// Updated PaymentSystem.jsx - Added generation of full order object with tracking points, estimated delivery, and storage to both 'completedOrder' (for client) and 'orders' array (for admin). Uses current date Nov 16, 2025 for timestamps. Enhanced success modal with order ID display.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiSmartphone, FiGlobe, FiTruck, FiShield, FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, FiStar, FiX, FiCheckCircle, FiPlus, FiPercent, FiClock, FiAward, FiLock, FiShoppingCart } from 'react-icons/fi';
import Confetti from 'react-confetti'; // Assume installed or use CSS alternative

const paymentMethods = [
  { id: 1, name: 'Credit/Debit Card', icon: FiCreditCard, description: 'Visa, Mastercard, Amex', active: true },
  { id: 2, name: 'Mobile Money', icon: FiSmartphone, description: 'MTN MoMo, Vodafone Cash, AirtelTigo', active: true },
  { id: 3, name: 'PayPal', icon: FiGlobe, description: 'Global wallet', active: true },
  { id: 4, name: 'Bank Transfer', icon: FiCreditCard, description: 'Direct bank transfer', active: true },
  { id: 5, name: 'Cash on Delivery', icon: FiTruck, description: 'Pay when delivered', active: true },
];

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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
};

export default function PaymentSystem() {
  const [order, setOrder] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(1); // Default to Card
  const [formData, setFormData] = useState({});
  const [saveDetails, setSaveDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 min countdown
  const [generatedOrderId, setGeneratedOrderId] = useState(null); // New: For success display
  const user = { name: 'Annette Murphy', avatar: 'https://i.pravatar.cc/40?img=3' };
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem('checkoutOrder') || '{}');
    setOrder(storedOrder);
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (id) => {
    setSelectedMethod(id);
    setFormData({});
  };

  const handlePayment = async () => {
    const requiredFields = selectedMethod === 1 ? 4 : selectedMethod === 5 ? 0 : 2;
    if (Object.keys(formData).length < requiredFields) {
      setErrorMessage('Please fill in all required payment details.');
      setShowError(true);
      return;
    }
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsProcessing(false);
    // Generate full order with tracking data (using Nov 16, 2025 as base)
    const now = new Date('2025-11-16T20:23:00'); // Current time: 08:23 PM GMT
    const orderId = 'SPICE' + Date.now();
    const fullOrder = {
      id: orderId,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shippingCost: order.shippingCost,
      total: order.total,
      shipping: order.shipping,
      promoDiscount: order.promoDiscount || 0,
      status: 'placed',
      timestamp: now.toISOString(),
      trackingPoints: [
        { name: 'Order Placed', time: now.toLocaleString('en-GH', { timeZone: 'GMT' }), status: 'completed' },
        { name: 'Preparing Spices', time: new Date(now.getTime() + 10 * 60 * 1000).toLocaleString('en-GH', { timeZone: 'GMT' }), status: 'in_progress' },
        { name: 'Out for Delivery', time: new Date(now.getTime() + 30 * 60 * 1000).toLocaleString('en-GH', { timeZone: 'GMT' }), status: 'pending' },
        { name: 'Delivered to Doorstep', time: new Date(now.getTime() + 60 * 60 * 1000).toLocaleString('en-GH', { timeZone: 'GMT' }), status: 'pending' },
      ],
      estimatedDelivery: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleString('en-GH', { timeZone: 'GMT', weekday: 'long', month: 'short', day: 'numeric' }),
      client: user.name,
    };
    setGeneratedOrderId(orderId);
    // Store for client tracking
    localStorage.setItem('completedOrder', JSON.stringify(fullOrder));
    // Store for admin (append to array)
    let adminOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    adminOrders.push(fullOrder);
    localStorage.setItem('orders', JSON.stringify(adminOrders));
    // Clear cart and checkout
    localStorage.setItem('cart', '[]');
    localStorage.removeItem('checkoutOrder');
    window.dispatchEvent(new CustomEvent('cartUpdated', { bubbles: true }));
    window.dispatchEvent(new CustomEvent('orderCompleted', { detail: { orderId } })); // For navbar update
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/dashbord-client/trackmyorder/' + orderId); // Auto-redirect to track
    }, 4000);
  };

  if (!order || !order.items || order.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto p-8 ">
          <FiShoppingCart className="mx-auto text-6xl text-orange-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Order Found</h1>
          <p className="text-gray-600 mb-6">Your cart is empty or order not ready. Add items to cart first.</p>
          <button 
            onClick={() => navigate('/dashbord-client/addtocart')} 
            className="px-6 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  const deliveryCost = order.shippingCost;
  const subtotal = order.subtotal;
  const total = order.total;
  const shippingType = order.shipping;
  const promoDiscount = order.promoDiscount || 0;

  const currentYear = new Date().getFullYear();
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen  py-8 px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
        gravity={0.2}
        run={showSuccess}
      />
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-orange-200/50"
        >
          {/* Header - Enhanced with spice theme */}
          <div className="px-6 py-6 bg-linear-to-r from-orange-500 to-red-500 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <FiShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-medium">SpiceVault Secure</span>
                  <h1 className="text-2xl font-bold">Checkout</h1>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FiUser className="w-4 h-4" />
                <span>{user.name}</span>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="px-6 py-4 bg-yellow-50 border-b">
            <p className="text-sm text-yellow-800 flex items-center justify-center">
              <FiClock className="mr-2" />
              Order expires in <span className="font-bold ml-1">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </p>
          </div>

          {/* Progress Steps - Animated */}
          <div className="px-6 py-4 bg-linear-to-r from-orange-50 to-red-50">
            <div className="flex justify-center items-center space-x-6">
              <motion.div className="flex items-center space-x-2 text-xs text-gray-600" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">1</div>
                <span>Bag</span>
              </motion.div>
              <motion.div className="w-20 h-1 bg-orange-500 rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 }} />
              <motion.div className="flex items-center space-x-2 text-xs text-gray-600" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">2</div>
                <span>Payment</span>
              </motion.div>
              <motion.div className="w-20 h-1 bg-gray-200 rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 }} />
              <motion.div className="flex items-center space-x-2 text-xs text-gray-500" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">3</div>
                <span>Confirm</span>
              </motion.div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Details - Enhanced with icons and animations */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FiCreditCard className="mr-2 text-orange-500" />
                  Choose Payment
                </h2>
                <div className="space-y-4">
                  {/* Payment Methods - Card style */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isActive = selectedMethod === method.id;
                      return (
                        <motion.button
                          key={method.id}
                          onClick={() => handleMethodChange(method.id)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                            isActive
                              ? 'border-orange-500 bg-orange-50 shadow-lg'
                              : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <motion.div 
                              animate={{ rotate: isActive ? 360 : 0 }} 
                              transition={{ duration: 0.5 }}
                              className={`p-2 rounded-xl ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                              <Icon size={20} />
                            </motion.div>
                            <div>
                              <p className="font-semibold text-gray-900">{method.name}</p>
                              <p className="text-xs text-gray-500">{method.description}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Form fields with better styling */}
                  {selectedMethod === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-1">
                          <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <FiCreditCard className="mr-2 text-orange-500" />
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber || ''}
                            onChange={handleInputChange}
                            className="w-full px-12 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all text-sm shadow-sm"
                            maxLength={19}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Name on Card</label>
                          <input
                            type="text"
                            name="name"
                            placeholder="Annette Murphy"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all text-sm shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                          <div className="flex space-x-2">
                            <select
                              name="expiryMonth"
                              value={formData.expiryMonth || ''}
                              onChange={handleInputChange}
                              className="w-1/2 px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-sm"
                            >
                              <option value="">MM</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1 < 10 ? `0${i + 1}` : i + 1}</option>
                              ))}
                            </select>
                            <select
                              name="expiryYear"
                              value={formData.expiryYear || ''}
                              onChange={handleInputChange}
                              className="w-1/2 px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-sm"
                            >
                              <option value="">YY</option>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = currentYear + i;
                                return <option key={year} value={year % 100}>{year % 100}</option>;
                              })}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="407"
                            value={formData.cvv || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-sm shadow-sm"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <label className="flex items-center space-x-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-2xl">
                        <input
                          type="checkbox"
                          checked={saveDetails}
                          onChange={(e) => setSaveDetails(e.target.checked)}
                          className="rounded border-orange-500 focus:ring-orange-500 text-orange-500"
                        />
                        <span>Save for faster checkouts next time ✨</span>
                      </label>
                    </div>
                  )}

                  {/* Simplified other methods */}
                  {selectedMethod === 2 && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center">
                        <FiSmartphone className="mr-2" />
                        Mobile Money
                      </h4>
                      <select name="provider" value={formData.provider || ''} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm">
                        <option value="">Select Provider</option>
                        <option value="MTN MoMo">MTN MoMo</option>
                        <option value="Vodafone Cash">Vodafone Cash</option>
                        <option value="AirtelTigo Money">AirtelTigo Money</option>
                      </select>
                      <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone || ''} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm" />
                      <input type="password" name="pin" placeholder="Transaction PIN" value={formData.pin || ''} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm" />
                    </div>
                  )}
                  {selectedMethod === 3 && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
                      <h4 className="text-sm font-bold text-gray-900">PayPal</h4>
                      <input type="email" name="email" placeholder="PayPal Email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm" />
                      <input type="password" name="password" placeholder="Password" value={formData.password || ''} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm" />
                    </div>
                  )}
                  {selectedMethod === 4 && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
                      <h4 className="text-sm font-bold text-gray-900">Bank Transfer</h4>
                      <input type="text" name="bankName" placeholder="Bank Name" value={formData.bankName || ''} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm" />
                      <input type="text" name="accountNumber" placeholder="Account Number" value={formData.accountNumber || ''} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm" />
                      <input type="text" name="reference" placeholder="Reference Code" value={formData.reference || ''} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm" />
                    </div>
                  )}
                  {selectedMethod === 5 && (
                    <motion.div 
                      initial={{ scale: 0.95 }} 
                      animate={{ scale: 1 }} 
                      className="p-6 bg-linear-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 text-center"
                    >
                      <FiTruck className="mx-auto w-12 h-12 text-yellow-600 mb-3" />
                      <p className="text-lg font-bold text-yellow-800">Cash on Delivery</p>
                      <p className="text-sm text-yellow-700 mt-2">Pay safely when your spices arrive fresh at your door. No prepayment needed!</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <motion.div className="text-center p-3 bg-green-50 rounded-xl" whileHover={{ scale: 1.05 }}>
                  <FiLock className="mx-auto w-6 h-6 text-green-600 mb-1" />
                  <p className="text-xs text-green-800 font-medium">SSL Secured</p>
                </motion.div>
                <motion.div className="text-center p-3 bg-blue-50 rounded-xl" whileHover={{ scale: 1.05 }}>
                  <FiAward className="mx-auto w-6 h-6 text-blue-600 mb-1" />
                  <p className="text-xs text-blue-800 font-medium">Trusted</p>
                </motion.div>
                <motion.div className="text-center p-3 bg-purple-50 rounded-xl" whileHover={{ scale: 1.05 }}>
                  <FiShield className="mx-auto w-6 h-6 text-purple-600 mb-1" />
                  <p className="text-xs text-purple-800 font-medium">Fraud Guard</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Order Summary - Card-based products, vibrant */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiShoppingCart className="mr-2 text-orange-500" />
                Your Spice Selection
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {order.items.map((item, idx) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center p-4 bg-linear-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200"
                  >
                    <img 
                      src={item.image || 'https://via.placeholder.com/60?text=Spice'} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-xl mr-4 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{item.category} • x{item.quantity}</p>
                    </div>
                    <span className="font-bold text-orange-600 text-lg ml-4">¢{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-orange-200 bg-orange-50 p-4 rounded-2xl">
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>Subtotal</span>
                  <span>¢{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping ({shippingType})</span>
                  <span>¢{deliveryCost.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <motion.div 
                    className="flex justify-between text-sm text-green-600 font-bold bg-green-50 p-2 rounded-xl"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                  >
                    <span>🌶️ Spice Discount</span>
                    <span>-¢{promoDiscount.toFixed(2)}</span>
                  </motion.div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-orange-200">
                  <span>Total</span>
                  <span className="text-2xl text-orange-600">¢{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons - Prominent checkout */}
              <motion.button
                onClick={handlePayment}
                disabled={isProcessing || timeLeft <= 0}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(251, 146, 60, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 transition-all shadow-xl ${
                  isProcessing || timeLeft <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Spicing Your Order...</span>
                  </>
                ) : timeLeft <= 0 ? (
                  <>
                    <FiClock className="w-5 h-5" />
                    <span>Session Expired</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-5 h-5" />
                    <span>Pay Now ¢{total.toFixed(2)}</span>
                  </>
                )}
              </motion.button>
              <button
                onClick={() => navigate('/dashbord-client/addtocart')}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
              >
                Edit Cart
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Modals - Enhanced success with confetti trigger */}
        {/* Error Modal - Same as before */}
        <AnimatePresence>
          {showError && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowError(false)}
            >
              <motion.div 
                className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setShowError(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <FiX size={24} />
                </button>
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <FiX className="w-10 h-10 text-red-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! A Pinch Too Much</h3>
                  <p className="text-gray-600 mb-6">{errorMessage}</p>
                  <button
                    onClick={() => setShowError(false)}
                    className="w-full py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all"
                  >
                    Fix It
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal - Enhanced with spice flair and order ID */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            >
              <motion.div 
                className="bg-linear-to-br from-green-50 to-emerald-50 rounded-3xl p-8 max-w-md w-full relative overflow-hidden shadow-2xl border border-green-200"
                initial={{ scale: 0.9, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: "backOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-green-400 to-emerald-500"></div>
                <div className="relative z-10 text-center pt-4">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 500 }}
                    className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <FiCheckCircle className="w-10 h-10 text-green-500 animate-bounce" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Spiced Up! 🌶️</h3>
                  <p className="text-gray-700 mb-6">Your flavors are on the way. Get ready to ignite your kitchen!</p>
                  <div className="space-y-3 text-sm text-gray-600 bg-white/50 p-4 rounded-2xl">
                    <p><strong>Order ID:</strong> #{generatedOrderId}</p>
                    <p><strong>ETA:</strong> {order.estimatedDelivery} • Track live</p>
                  </div>
                  <motion.button
                    onClick={() => setShowSuccess(false)}
                    whileHover={{ scale: 1.05 }}
                    className="w-full py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold mt-4 shadow-lg"
                  >
                    Track My Order
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Trust */}
        <motion.footer 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1 }}
          className="text-center py-8 text-xs text-gray-500"
        >
          <p>🔒 Secured by SpiceVault • Loved by 50k+ flavor fans • 100% Satisfaction or Your Money Back</p>
        </motion.footer>
      </div>
    </div>
  );
}