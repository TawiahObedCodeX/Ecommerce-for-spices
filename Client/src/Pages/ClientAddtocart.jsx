// Updated ClientAddtocart.jsx - Added relative navigation for nested routes, fallbacks for fullCart, and debug logs
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiCreditCard, FiCheckCircle, FiX, FiPlayCircle, FiStar, FiTag, FiArrowLeft, FiMapPin, FiClock, FiPercent, FiPlusCircle, FiTruck } from 'react-icons/fi';

const DB_NAME = 'SpiceDB';
const STORE_NAME = 'products';
const VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function getProductById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export default function ClientAddtocart() {
  const [cart, setCart] = useState([]); // Essential cart data
  const [fullCart, setFullCart] = useState([]); // Full cart with media
  const [isRemoving, setIsRemoving] = useState(null);
  const [videoModal, setVideoModal] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState('free-pickup'); // Default shipping option
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const navigate = useNavigate();

  // Load essential cart and fetch full details
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  // Fetch full cart details when essential cart changes
  useEffect(() => {
    const fetchFullCart = async () => {
      if (cart.length === 0) {
        setFullCart([]);
        return;
      }
      try {
        const fullItems = await Promise.all(
          cart.map(async (item) => {
            try {
              const full = await getProductById(item.id);
              if (!full) {
                console.warn(`Product ID ${item.id} not found in DB - using basic cart data.`);
                return { ...item, image: null, video: null, origin: item.origin || 'Global Sourcing' }; // Fallback: Use cart data without media
              }
              return { ...item, image: full.image, video: full.video, origin: full.origin || 'Global Sourcing' };
            } catch (err) {
              console.error(`Error fetching product ${item.id}:`, err);
              return { ...item, image: null, video: null, origin: item.origin || 'Global Sourcing' }; // Fallback
            }
          })
        );
        setFullCart(fullItems); // No longer filtering nulls - use fallbacks
        // Clean up only if entire item fetch failed (rare)
        const validCart = cart.filter((_, idx) => fullItems[idx] !== null);
        if (validCart.length !== cart.length) {
          setCart(validCart);
          localStorage.setItem('cart', JSON.stringify(validCart));
          window.dispatchEvent(new CustomEvent('cartUpdated', { bubbles: true }));
        }
      } catch (error) {
        console.error('Error fetching full cart:', error);
        // Ultimate fallback: Use cart as-is without media
        setFullCart(cart.map(item => ({ ...item, image: null, video: null, origin: item.origin || 'Global Sourcing' })));
      }
    };
    fetchFullCart();
  }, [cart]);

  // Listen for cart updates in real-time (same tab)
  useEffect(() => {
    const handleCartUpdated = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(updatedCart);
    };
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  // Cross-tab listener for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        const updatedCart = JSON.parse(e.newValue || '[]');
        setCart(updatedCart);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    const updatedCart = cart.map((item) => (item.id === id ? { ...item, quantity } : item));
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { bubbles: true }));
  };

  const removeFromCart = (id) => {
    setIsRemoving(id);
    setTimeout(() => {
      const updatedCart = cart.filter((item) => item.id !== id);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cartUpdated', { bubbles: true }));
      setIsRemoving(null);
    }, 300);
  };

  const openVideo = (videoSrc) => {
    setVideoModal(videoSrc);
  };

  const applyPromo = () => {
    if (promoCode === 'SPICE10') {
      setPromoDiscount(0.1 * subtotal);
      setPromoError('');
    } else {
      setPromoDiscount(0);
      setPromoError('Invalid promo code');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.05;
  const shippingCost = selectedShipping === 'free-pickup' ? 0 : 9.99; // Example: Free for pickup, $9.99 for delivery
  const total = subtotal + tax + shippingCost - promoDiscount;

  const handleProceedToPayment = () => {
    console.log('Proceeding to payment - Cart length:', cart.length, 'FullCart length:', fullCart.length); // Debug log
    if (cart.length === 0) {
      alert('No items in cart. Please add items before proceeding to checkout.');
      return;
    }
    // Save with fallback data - use fullCart if available, otherwise cart
    const itemsToSave = fullCart.length > 0 ? fullCart : cart;
    const orderData = {
      items: itemsToSave,
      subtotal,
      tax,
      shippingCost,
      total,
      shipping: selectedShipping,
      promoDiscount,
    };
    localStorage.setItem('checkoutOrder', JSON.stringify(orderData));
    console.log('Order saved to localStorage:', orderData); // Debug log
    // Navigate immediately
    navigate('clientpaymentsystem');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4 max-w-md"
        >
          <FiShoppingCart className="mx-auto text-8xl text-orange-400 mb-6 animate-bounce" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Cart Feels Empty</h1>
          <p className="text-xl text-gray-600 mb-8">Time to add some fiery spices that’ll make your meals unforgettable!</p>
          <motion.button
            onClick={() => navigate('/dashbord-client')}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(251, 146, 60, 0.3)" }}
            className="py-4 px-10 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg shadow-lg"
          >
            Explore Spices
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-linear-to-br from-gray-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        {/* Header - Slightly asymmetric for human touch */}
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <FiShoppingCart className="text-3xl text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800">Your Spice product ({cart.length} items)</h1>
          </motion.div>
          <motion.button
            onClick={() => navigate('/dashbord-client')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-orange-500 hover:text-orange-600 font-semibold flex items-center space-x-2 text-lg"
          >
            <FiArrowLeft />
            <span>Keep Browsing</span>
          </motion.button>
        </div>

        {/* Cart Items - Card layout for better mobile, with subtle stagger */}
        <div className="grid gap-6 mb-8">
          <AnimatePresence>
            {fullCart.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Product Image & Details */}
                  <div className="md:col-span-2 flex items-start space-x-4">
                    <motion.img 
                      src={item.image || 'https://via.placeholder.com/100x100?text=Spice'} // Fallback image
                      alt={item.name} 
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shrink-0 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-800 mb-1 leading-tight">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      {/* Origin & Rating Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          <FiMapPin className="w-3 h-3 mr-1" />
                          {item.origin}
                        </span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar 
                              key={star} 
                              className={`w-4 h-4 ${star <= item.rating ? 'text-orange-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="ml-1 text-xs text-gray-500">({item.rating})</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <FiTag className="w-3 h-3 mr-1" />
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {/* Price & Controls */}
                  <div className="text-right md:text-center">
                    <div className="space-y-3">
                      <span className="text-2xl font-bold text-orange-600 block">¢{item.price}</span>
                      <div className="flex items-center justify-center space-x-3">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)} 
                          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="text-xl font-semibold min-w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)} 
                          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-lg font-semibold text-gray-800 block">¢{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      {/* Actions */}
                      <div className="flex justify-center space-x-2 pt-2">
                        <motion.button
                          onClick={() => removeFromCart(item.id)}
                          whileHover={{ scale: 1.1 }}
                          className={`p-2 rounded-full ${isRemoving === item.id ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors'}`}
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                        {item.video && (
                          <motion.button
                            onClick={() => openVideo(item.video)}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="p-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
                          >
                            <FiPlayCircle size={18} />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary & Shipping - Card with promo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <FiMapPin className="mr-2 text-orange-500" />
            Delivery Options
          </h3>
          <div className="space-y-4 mb-6">
            <label className="flex items-start space-x-4 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <input
                type="radio"
                name="shipping"
                value="free-pickup"
                checked={selectedShipping === 'free-pickup'}
                onChange={(e) => setSelectedShipping(e.target.value)}
                className=" h-5 w-5 text-orange-500 focus:ring-orange-500 mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <FiClock className="w-4 h-4 text-green-500 mr-2" />
                  <span className="font-bold text-gray-800">Free Pickup - Ready in 30 min</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">Collect from our spice hub today (10AM - 8PM)</p>
              </div>
            </label>
            <label className="flex items-start space-x-4 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <input
                type="radio"
                name="shipping"
                value="delivery"
                checked={selectedShipping === 'delivery'}
                onChange={(e) => setSelectedShipping(e.target.value)}
                className=" h-5 w-5 text-orange-500 focus:ring-orange-500 mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <FiTruck className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="font-bold text-gray-800">Home Delivery - ¢9.99</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">Doorstep in 1-2 days, tracked every step</p>
              </div>
            </label>
          </div>
          {/* Promo Code */}
          <div className="border-t pt-4 mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter promo code (e.g., SPICE10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <motion.button
                onClick={applyPromo}
                whileHover={{ scale: 1.02 }}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                Apply
              </motion.button>
            </div>
            {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
            {promoDiscount > 0 && <p className="text-green-600 text-sm mt-1">Discount applied: -¢{promoDiscount.toFixed(2)}</p>}
          </div>
          {/* Totals */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between font-medium">
              <span>Subtotal ({cart.length} spices)</span>
              <span>¢{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>¢{shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>¢{tax.toFixed(2)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Promo Discount</span>
                <span>-¢{promoDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
              <span>Total</span>
              <span>¢{total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Checkout Button - Prominent with icon */}
        <motion.button
          onClick={handleProceedToPayment}
          whileHover={{ scale: 1.02, boxShadow: "0 15px 35px rgba(251, 146, 60, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-5 bg-linear-to-r from-orange-500 via-red-500 to-orange-600 text-white rounded-2xl font-bold text-xl flex items-center justify-center space-x-3 shadow-2xl mb-4"
        >
          <FiCreditCard className="w-6 h-6" />
          <span>Proceed to Secure Checkout ¢{total.toFixed(2)}</span>
        </motion.button>

        {/* Video Modal - Enhanced with full video height, no aspect constraint */}
        <AnimatePresence>
          {videoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setVideoModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-6 bg-gray-50 border-b">
                  <h3 className="text-2xl font-bold text-gray-800">Spice in Action</h3>
                  <button onClick={() => setVideoModal(null)} className="p-2 hover:bg-gray-200 rounded-full">
                    <FiX size={24} className="text-gray-600" />
                  </button>
                </div>
                <div className="flex-1 p-6 overflow-auto">
                  <video
                    src={videoModal}
                    controls
                    className="w-full rounded-2xl shadow-xl"
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}