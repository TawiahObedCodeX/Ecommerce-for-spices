// Updated PaymentSystem.jsx - Connected to cart: loads full order from 'checkoutOrder', displays multiple items in summary, clears cart on success
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiSmartphone, FiGlobe, FiTruck, FiShield, FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, FiStar, FiX, FiCheckCircle, FiPlus } from 'react-icons/fi';

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
    transition: { duration: 0.5 },
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
  const user = { name: 'Annette Murphy', avatar: 'https://i.pravatar.cc/40?img=3' };
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem('checkoutOrder') || '{}');
    setOrder(storedOrder);
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
    // Clear cart and order on success
    localStorage.setItem('cart', '[]');
    localStorage.removeItem('checkoutOrder');
    window.dispatchEvent(new CustomEvent('cartUpdated', { bubbles: true }));
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/dashbord-client');
    }, 3000);
  };

  if (!order || !order.items || order.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm border">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">No Order Found</h1>
          <p className="text-gray-600 mb-6">Your cart is empty or order not ready. Add items to cart first.</p>
          <button 
            onClick={() => navigate('/dashbord-client/addtocart')} 
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
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

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-8 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Tolly</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <div className="w-px h-6 bg-gray-200"></div>
              <button className="text-sm text-gray-500 hover:text-gray-700">Sign out</button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-center space-x-8">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium">1</div>
                <span>Shipping</span>
              </div>
              <div className="flex-1 h-px bg-orange-200"></div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium">2</div>
                <span>Payment</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-6 h-6 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-medium">3</div>
                <span>Review</span>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Details */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment details</h2>
                <div className="space-y-4">
                  {/* Payment Methods Tabs */}
                  <div className="flex space-x-1 border-b border-gray-200">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isActive = selectedMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => handleMethodChange(method.id)}
                          className={`px-4 py-2 text-xs font-medium flex items-center space-x-1 ${
                            isActive
                              ? 'text-orange-600 border-b-2 border-orange-500'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Icon size={14} />
                          <span>{method.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Card Form - Default/Active */}
                  {selectedMethod === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
                          <div className="relative">
                            <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber || ''}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                              maxLength={19}
                            />
                          </div>
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Name on Card</label>
                          <input
                            type="text"
                            name="name"
                            placeholder="Annette Murphy"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                          <div className="flex space-x-2">
                            <select
                              name="expiryMonth"
                              value={formData.expiryMonth || ''}
                              onChange={handleInputChange}
                              className="w-1/2 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                              className="w-1/2 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                          <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="407"
                            value={formData.cvv || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <label className="flex items-center space-x-2 text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={saveDetails}
                          onChange={(e) => setSaveDetails(e.target.checked)}
                          className="rounded text-orange-500 focus:ring-orange-500"
                        />
                        <span>Save details for future purchases</span>
                      </label>
                    </div>
                  )}

                  {/* Other Methods Forms - Simplified for brevity */}
                  {selectedMethod === 2 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900">Mobile Money Details</h4>
                      <select name="provider" value={formData.provider || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm">
                        <option value="">Select Provider</option>
                        <option value="MTN MoMo">MTN MoMo</option>
                        <option value="Vodafone Cash">Vodafone Cash</option>
                        <option value="AirtelTigo Money">AirtelTigo Money</option>
                      </select>
                      <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                      <input type="password" name="pin" placeholder="Transaction PIN" value={formData.pin || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  )}
                  {selectedMethod === 3 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900">PayPal Details</h4>
                      <input type="email" name="email" placeholder="PayPal Email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                      <input type="password" name="password" placeholder="Password" value={formData.password || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  )}
                  {selectedMethod === 4 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900">Bank Transfer Details</h4>
                      <input type="text" name="bankName" placeholder="Bank Name" value={formData.bankName || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                      <input type="text" name="accountNumber" placeholder="Account Number" value={formData.accountNumber || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                      <input type="text" name="reference" placeholder="Reference Code" value={formData.reference || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  )}
                  {selectedMethod === 5 && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">Payment will be collected upon delivery. No upfront charge.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                <FiShield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">Card is secure. Everything is private.</p>
              </div>
            </motion.div>

            {/* Order Summary - Updated for multiple items */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-10 h-10 object-cover rounded-lg hrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 truncate">{item.category}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-2 shrink-0">¢{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>¢{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Estimated shipping ({shippingType})</span>
                  <span>¢{deliveryCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <span>Total amount</span>
                  <span>¢{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2">
                  <FiPlus className="w-4 h-4" />
                  <span>Add new</span>
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <span>Confirm order</span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/dashbord-client/addtocart')}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Error Modal */}
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
                className="bg-white rounded-2xl p-6 max-w-md w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setShowError(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <FiX size={20} />
                </button>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiX className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
                  <p className="text-gray-600 mb-6">{errorMessage}</p>
                  <button
                    onClick={() => setShowError(false)}
                    className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Got it
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div 
                className="bg-white rounded-2xl p-6 max-w-md w-full relative overflow-hidden"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-green-400 to-green-600"></div>
                <div className="text-center pt-2">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <FiCheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Confirmed!</h3>
                  <p className="text-gray-600 mb-6">Your order is on its way. Thank you for choosing us! 🚀</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>Order ID: #{Math.floor(Math.random() * 1000000)}</p>
                    <p>Estimated Delivery: 2-3 days</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-gray-500 mt-6">
          Trusted by thousands. Secure checkout guaranteed.
        </p>
      </div>
    </div>
  );
}