// Updated ClientAddtocart.jsx - No changes needed, already connects via localStorage and navigation
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiCreditCard, FiCheckCircle, FiX, FiPlayCircle, FiStar, FiTag, FiArrowLeft } from 'react-icons/fi';

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
                return null;
              }
              return { ...item, image: full.image, video: full.video };
            } catch {
              return null;
            }
          })
        );
        const validFull = fullItems.filter(Boolean);
        setFullCart(validFull);
        // Clean up deleted products from cart
        const validCart = cart.filter((_, idx) => fullItems[idx] !== null);
        if (validCart.length !== cart.length) {
          setCart(validCart);
          localStorage.setItem('cart', JSON.stringify(validCart));
          window.dispatchEvent(new CustomEvent('cartUpdated', { bubbles: true }));
        }
      } catch (error) {
        console.error('Error fetching full cart:', error);
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

  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.05;
  const shippingCost = selectedShipping === 'free-pickup' ? 0 : 9.99; // Example: Free for pickup, $9.99 for delivery
  const total = subtotal + tax + shippingCost;

  const handleProceedToPayment = () => {
    localStorage.setItem('checkoutOrder', JSON.stringify({ items: fullCart, subtotal, tax, shippingCost, total, shipping: selectedShipping }));
    navigate('/dashbord-client/paymenttoadmin');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4"
        >
          <FiShoppingCart className="mx-auto text-6xl text-gray-400 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
          <p className="text-lg text-gray-600 mb-6">Add some spices to get started!</p>
          <motion.button
            onClick={() => navigate('/dashbord-client')}
            whileHover={{ scale: 1.05 }}
            className="py-3 px-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold"
          >
            Browse for product
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-800"
          >
            My Cart
          </motion.h1>
          <motion.button
            onClick={() => navigate('/dashbord-client')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center space-x-1"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Continue shopping</span>
          </motion.button>
        </div>

        {/* Cart Items Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Qty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {fullCart.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, j) => (
                                <FiStar key={j} className={`w-3 h-3 ${j < item.rating ? 'text-orange-500 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="ml-1 text-xs text-gray-500">({item.rating})</span>
                          </div>
                          <motion.span 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 mt-1"
                          >
                            <FiTag className="w-2 h-2 mr-1" />
                            {item.category}
                          </motion.span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">¢{item.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 text-sm">-</button>
                        <span className="font-semibold min-w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 text-sm">+</button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">¢{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className={`p-1 rounded-full ${isRemoving === item.id ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500'}`}
                        >
                          <FiTrash2 size={14} />
                        </button>
                        <motion.button
                          onClick={() => openVideo(item.video)}
                          whileHover={{ scale: 1.05 }}
                          className="ml-2 p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md"
                        >
                          <FiPlayCircle size={16} className="text-orange-500" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Shipping and Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Choose shipping mode:</h3>
          <div className="space-y-4 mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="shipping"
                value="free-pickup"
                checked={selectedShipping === 'free-pickup'}
                onChange={(e) => setSelectedShipping(e.target.value)}
                className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500"
              />
              <div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span className="font-semibold text-gray-800">Pick up in 30 min - FREE</span>
                </div>
                <p className="text-sm text-gray-600 ml-5">Available today 10:00 AM - 8:00 PM</p>
              </div>
            </label>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="shipping"
                value="delivery"
                checked={selectedShipping === 'delivery'}
                onChange={(e) => setSelectedShipping(e.target.value)}
                className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500"
              />
              <div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="font-semibold text-gray-800">Delivery in 1-2 days - ¢9.99</span>
                </div>
                <p className="text-sm text-gray-600 ml-5">Arrives at home in 1-2 days</p>
              </div>
            </label>
          </div>
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
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
            <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span>¢{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <motion.button
          onClick={handleProceedToPayment}
          whileHover={{ scale: 1.02 }}
          className="w-full py-4 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transition-all"
        >
          <FiCreditCard />
          <span>make payment ¢{total.toFixed(2)}</span>
        </motion.button>

        {/* Video Modal */}
        <AnimatePresence>
          {videoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              onClick={() => setVideoModal(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] "
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-bold">Product Video</h3>
                  <button onClick={() => setVideoModal(null)}>
                    <FiX size={24} className="text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
                <div className="p-6">
                  <video
                    src={videoModal}
                    controls
                    className="w-full h-64 rounded-2xl object-cover"
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