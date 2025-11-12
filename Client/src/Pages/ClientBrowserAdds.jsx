// Updated ClientBrowserAdds.jsx - Changed cart item to store only essential data to avoid localStorage quota issues with media files
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiShoppingCart, FiCheck, FiTag, FiHeart } from 'react-icons/fi';
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
async function getProducts() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const all = request.result.sort((a, b) => b.id - a.id);
      resolve(all);
    };
    request.onerror = () => reject(request.error);
  });
}
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 },
  },
  fly: {
    scale: [1, 1.2, 0.3],
    rotate: [0, 180, 360],
    y: [0, -50, window.innerHeight],
    x: [0, 0, window.innerWidth * 0.8],
    opacity: [1, 1, 0],
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
export default function ClientBrowserAdds() {
  const [products, setProducts] = useState([]);
  const [addSuccess, setAddSuccess] = useState(null);
  const [flyingCard, setFlyingCard] = useState(null);
  const navigate = useNavigate();
  const productRefs = useRef([]);
  // Initial load from IndexedDB
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = await getProducts();
        setProducts(storedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);
  // Real-time update listener for productAdded event
  useEffect(() => {
    const handleProductAdded = async () => {
      try {
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error updating products:', error);
      }
    };
    window.addEventListener('productAdded', handleProductAdded);
    return () => {
      window.removeEventListener('productAdded', handleProductAdded);
    };
  }, []);
  // Real-time update listener for productsUpdated event (handles deletes)
  useEffect(() => {
    const handleProductsUpdated = async () => {
      try {
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error updating products:', error);
      }
    };
    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);
  // Cross-tab update listener for localStorage changes
  useEffect(() => {
    const handleStorageChange = async (e) => {
      if (e.key === 'productsUpdated') {
        try {
          const updatedProducts = await getProducts();
          setProducts(updatedProducts);
        } catch (error) {
          console.error('Error updating products:', error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  const handleAddToCart = (product, index) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const cartItem = {
        id: product.id,
        name: product.name,
        description: product.description || '',
        category: product.category,
        price: product.price,
        rating: product.rating,
        quantity: 1,
      };
      cart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    // Capture card rect for flying animation (uses full product.image briefly)
    const cardRect = productRefs.current[index]?.getBoundingClientRect();
    if (cardRect) {
      setFlyingCard({ product, index, rect: cardRect });
      setTimeout(() => setFlyingCard(null), 1000);
    }
    // Dispatch event for navbar update
    window.dispatchEvent(new CustomEvent('cartUpdated', { bubbles: true }));
    // Success state
    setAddSuccess(product.id);
    setTimeout(() => setAddSuccess(null), 2000);
  };
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">No Spices Available Yet</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">Check back soon for flavorful additions!</p>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Browse Spice Delights
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              ref={(el) => (productRefs.current[i] = el)}
              className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer group relative"
              onClick={(e) => {
                if (e.target.closest('button')) return;
              }}
            >
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-3 left-3 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-orange-600 shadow-md"
                >
                  <FiTag className="mr-1 w-3 h-3" />
                  {product.category}
                </motion.span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </motion.button>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <FiStar
                        key={j}
                        className={`text-sm ${j < product.rating ? 'text-orange-500 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-600 mb-4">¢{product.price}</p>
                <motion.button
                  onClick={() => handleAddToCart(product, i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={addSuccess === product.id ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Flying Card Animation to Cart Icon */}
        <AnimatePresence>
          {flyingCard && (
            <motion.div
              className="fixed z-50 pointer-events-none"
              initial={{ opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                x: (window.innerWidth / 2 - flyingCard.rect.width / 2) - flyingCard.rect.left,
                y: (window.innerHeight - 150) - flyingCard.rect.top,
                scale: 0.3,
                opacity: 0,
                rotate: 360,
              }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              exit={{ opacity: 0 }}
            >
              <div className="w-full h-full bg-white rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={flyingCard.product.image}
                  alt={flyingCard.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Success Toast */}
        <AnimatePresence>
          {addSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center space-x-2"
            >
              <FiCheck size={20} />
              <span>Added to Cart!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}