import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCreditCard, FiSmartphone, FiCheckCircle, FiArrowLeft, FiShield, FiGlobe, FiLock, FiUser, FiMail, FiPhone, FiCalendar, FiStar, FiTruck } from 'react-icons/fi';

const paymentMethods = [
  { id: 1, name: 'Credit/Debit Card', icon: FiCreditCard, description: 'Visa, Mastercard, Amex', active: false },
  { id: 2, name: 'Mobile Money', icon: FiSmartphone, description: 'MTN MoMo, Vodafone Cash, AirtelTigo', active: false },
  { id: 3, name: 'PayPal', icon: FiGlobe, description: 'Global wallet', active: false },
  { id: 4, name: 'Bank Transfer', icon: FiCreditCard, description: 'Direct bank transfer', active: false },
  { id: 5, name: 'Cash on Delivery', icon: FiTruck, description: 'Pay when delivered', active: false },
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

export default function PaymentSystem() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(1); // Default to Card
  const [formData, setFormData] = useState({});
  const [saveDetails, setSaveDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const product = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
    setSelectedProduct(product);
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
      alert('Please fill in all required payment details.');
      return;
    }
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsProcessing(false);
    alert('Payment confirmed! Your order is on its way. Thank you for choosing us.');
    navigate('/dashbord-client');
  };

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm border">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Empty Cart</h1>
          <p className="text-gray-600 mb-6">Add some spices before checking out.</p>
          <button 
            onClick={() => navigate('/dashbord-client/addtocart')} 
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  const deliveryCost = 5.00;
  const subtotal = parseFloat(selectedProduct.price);
  const total = subtotal + deliveryCost;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate('/dashbord-client/addtocart')}
          className="flex items-center space-x-2 mb-6 text-gray-600 hover:text-gray-800 font-medium"
        >
          <FiArrowLeft size={20} />
          <span>Back to Cart</span>
        </button>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
        >
          {/* Progress Steps */}
          <div className="px-4 py-3 bg-gray-50 border-b">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
                <span>Customer Details</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-3"></div>
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium">2</div>
                <span>Payment Method</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-3"></div>
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-xs font-medium">3</div>
                <span>Confirmation</span>
              </div>
            </div>
          </div>

          {/* Product Summary */}
          <motion.div variants={itemVariants} className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-900 truncate">{selectedProduct.name}</h2>
                <p className="text-xs text-gray-600 truncate">{selectedProduct.category} • Rated {selectedProduct.rating}/5</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{selectedProduct.description}</p>
              </div>
              <p className="text-lg font-semibold text-orange-600 flex-shrink-0">¢{subtotal}</p>
            </div>
          </motion.div>

          {/* Security Badge */}
          <motion.div variants={itemVariants} className="p-3 bg-blue-50 border-b flex items-center justify-center text-xs text-blue-800">
            <FiShield className="mr-1 w-3 h-3" />
            <span>Protected by 256-bit SSL encryption. Secure & Trusted Payments</span>
          </motion.div>

          {/* Main Layout: Payment Methods Left, Form Right */}
          <div className="p-4 flex flex-col lg:flex-row gap-6">
            {/* Left: Payment Methods */}
            <motion.div variants={itemVariants} className="flex-1 lg:w-1/3">
              <h3 className="text-base font-semibold mb-3 text-gray-900">Payment Method</h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  return (
                    <label key={method.id} className="flex items-center space-x-3 p-2.5 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={isSelected}
                        onChange={() => handleMethodChange(method.id)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <Icon className={`text-lg ${isSelected ? 'text-orange-500' : 'text-gray-500'}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${isSelected ? 'text-orange-600' : 'text-gray-900'}`}>{method.name}</div>
                        <div className="text-xs text-gray-600">{method.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </motion.div>

            {/* Right: Form and Summary */}
            <motion.div variants={itemVariants} className="flex-1 lg:w-2/3 flex flex-col lg:flex-row gap-6">
              {/* Form */}
              <div className="flex-1">
                {selectedMethod === 1 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-900 mb-2">Card Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={formData.cardNumber || ''}
                        onChange={handleInputChange}
                        className="p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        maxLength={19}
                      />
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          name="name"
                          placeholder="Cardholder Name"
                          value={formData.name || ''}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <select
                        name="expiryMonth"
                        value={formData.expiryMonth || ''}
                        onChange={handleInputChange}
                        className="p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1 < 10 ? `0${i + 1}` : i + 1}</option>
                        ))}
                      </select>
                      <select
                        name="expiryYear"
                        value={formData.expiryYear || ''}
                        onChange={handleInputChange}
                        className="p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return <option key={year} value={year}>{year}</option>;
                        })}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div></div>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={formData.cvv || ''}
                        onChange={handleInputChange}
                        className="p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        maxLength={4}
                      />
                    </div>
                    <label className="flex items-center space-x-2 mt-3 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={saveDetails}
                        onChange={(e) => setSaveDetails(e.target.checked)}
                        className="rounded"
                      />
                      <span>Save details for future purchases</span>
                    </label>
                  </div>
                )}

                {selectedMethod === 2 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-900 mb-2">Mobile Money Details</h4>
                    <div className="space-y-2">
                      <select name="provider" value={formData.provider || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md text-sm">
                        <option value="">Select Provider</option>
                        <option value="MTN MoMo">MTN MoMo</option>
                        <option value="Vodafone Cash">Vodafone Cash</option>
                        <option value="AirtelTigo Money">AirtelTigo Money</option>
                      </select>
                      <input type="text" name="phone" placeholder="Phone Number" value={formData.phone || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md text-sm" />
                      <input type="password" name="pin" placeholder="Transaction PIN" value={formData.pin || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                )}
                {selectedMethod === 3 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-900 mb-2">PayPal Details</h4>
                    <div className="space-y-2">
                      <input type="email" name="email" placeholder="PayPal Email" value={formData.email || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md text-sm" />
                      <input type="password" name="password" placeholder="Password" value={formData.password || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                )}
                {selectedMethod === 4 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-900 mb-2">Bank Transfer Details</h4>
                    <div className="space-y-2">
                      <input type="text" name="bankName" placeholder="Bank Name" value={formData.bankName || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md text-sm" />
                      <input type="text" name="accountNumber" placeholder="Account Number" value={formData.accountNumber || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md text-sm" />
                      <input type="text" name="reference" placeholder="Reference Code" value={formData.reference || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                )}
                {selectedMethod === 5 && (
                  <div className="p-3 bg-yellow-50 rounded-md">
                    <p className="text-xs text-yellow-800">Payment will be collected upon delivery. No upfront charge.</p>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:w-80 flex-shrink-0">
                <h4 className="text-base font-semibold mb-3 text-gray-900">Order Summary</h4>
                <div className="space-y-1.5 text-xs bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between">
                    <span>Subtotal (1 item)</span>
                    <span>¢{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Cost</span>
                    <span>¢{deliveryCost}</span>
                  </div>
                  <div className="border-t pt-1.5 flex justify-between font-semibold text-base text-orange-600">
                    <span>Total</span>
                    <span>¢{total}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Confirm Button */}
          <motion.div variants={itemVariants} className="p-4 border-t bg-gray-50">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Confirming Payment...</span>
                </>
              ) : (
                <span>Confirm Payment ¢{total}</span>
              )}
            </button>
          </motion.div>
        </motion.div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Trusted by thousands. Secure checkout guaranteed.
        </p>
      </div>
    </div>
  );
}