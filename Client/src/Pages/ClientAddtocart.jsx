// Updated ClientAddtocart.jsx - Added real-time listener for cartUpdated event to refresh cart state immediately
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiCreditCard, FiCheckCircle, FiX, FiPlayCircle, FiStar, FiTag } from 'react-icons/fi';

export default function ClientAddtocart() {
  const [cart, setCart] = useState([]);
  const [isRemoving, setIsRemoving] = useState(null);
  const [videoModal, setVideoModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);

    // Listen for cart updates in real-time
    const handleCartUpdated = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(updatedCart);
    };

    window.addEventListener('cartUpdated', handleCartUpdated);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
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
  const total = subtotal + tax;

  const handleProceedToPayment = () => {
    localStorage.setItem('checkoutOrder', JSON.stringify({ items: cart, subtotal, tax, total }));
    navigate('/dashbord-client/paymenttoadmin');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
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
            Browse Store
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Your Spice Cart
        </motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {cart.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow"
            >
              <div className="relative">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <motion.span 
                  className="absolute top-3 left-3 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-orange-600 shadow-md"
                >
                  <FiTag className="mr-1 w-3 h-3" />
                  {item.category}
                </motion.span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{item.description}</p>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <FiStar key={j} className={`text-lg ${j < item.rating ? 'text-orange-500 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">({item.rating}/5)</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">¢{item.price} x {item.quantity}</p>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">-</button>
                    <span className="font-semibold min-w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={`p-2 rounded-full ${isRemoving === item.id ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500'}`}
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <motion.button
                    onClick={() => openVideo(item.video)}
                    whileHover={{ scale: 1.05 }}
                    className="ml-auto p-2 bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg"
                  >
                    <FiPlayCircle size={24} className="text-orange-500" />
                  </motion.button>
                </div>
              </div>
              <AnimatePresence>
                {isRemoving === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
                  >
                    <FiCheckCircle className="text-green-500 text-3xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Order Summary</h3>
          <div className="space-y-3 text-lg mb-6">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <span>¢{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>¢{tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-2xl text-orange-600">
              <span>Total</span>
              <span>¢{total.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mb-6 italic">Secure checkout • Fresh & authentic spices guaranteed</p>
          <motion.button
            onClick={handleProceedToPayment}
            whileHover={{ scale: 1.02 }}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transition-all"
          >
            <FiCreditCard />
            <span>Proceed to Secure Payment</span>
          </motion.button>
          <div className="flex justify-center mt-4 space-x-4 text-xs text-gray-500">
            <span>Protected by SSL</span>
            <span>•</span>
            <span>Trusted Payments</span>
          </div>
        </motion.div>

        {/* Video Modal - White container */}
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
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
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