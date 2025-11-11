// Updated ClientBrowserAdds.jsx - Enhanced engaging, trustworthy UI with wider cards, reduced height, and captivating modal
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiShoppingCart, FiX, FiPlay, FiTag, FiShare2, FiHeart } from 'react-icons/fi';

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
    scale: 1.03,
    boxShadow: '0 20px 40px rgba(251, 146, 60, 0.2)',
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.2 } },
};

export default function ClientBrowserAdds() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Initial load from IndexedDB
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = await getProducts();
        setProducts(storedProducts);
        console.log('Loaded products in client browse:', storedProducts); // Debug log
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
        console.log('Updated products via event in client browse:', updatedProducts); // Debug log
      } catch (error) {
        console.error('Error updating products:', error);
      }
    };

    window.addEventListener('productAdded', handleProductAdded);

    return () => {
      window.removeEventListener('productAdded', handleProductAdded);
    };
  }, []);

  // Cross-tab update listener for localStorage changes
  useEffect(() => {
    const handleStorageChange = async (e) => {
      if (e.key === 'productsUpdated') {
        try {
          const updatedProducts = await getProducts();
          setProducts(updatedProducts);
          console.log('Updated products via storage event in client browse:', updatedProducts); // Debug log
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

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleProceedToOrder = () => {
    setIsModalOpen(false);
    // Save selected product to localStorage for payment page
    localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
    navigate('/dashbord-client/paymenttoadmin');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.name,
        text: `Check out this amazing ${selectedProduct.name}! Perfect for your next meal.`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`Check out ${selectedProduct.name} at ${window.location.href}`);
      alert('Link copied to clipboard! Share with friends and family.');
    }
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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
    <div className="min-h-screen py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto"> {/* Wider container for more breathing room */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Browse Spice Delights
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"> {/* Wider cards: xl:grid-cols-4 for more horizontal space */}
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-gradient-to-br from-white to-orange-50 rounded-3xl overflow-hidden shadow-md group cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-orange-200" // Subtle gradient bg, trustworthy borders
            >
              <div className="relative overflow-hidden">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" // Reduced height for squatter cards
                  whileHover={{ scale: 1.05 }}
                />
                {/* Category badge with subtle animation */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-3 left-3"
                >
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-orange-600 shadow-md border border-orange-200">
                    <FiTag className="mr-1 w-3 h-3" />
                    {product.category}
                  </span>
                </motion.div>
                {/* Favorite overlay */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <FiHeart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                </motion.button>
              </div>
              <div className="p-5"> {/* Slightly reduced padding */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <FiStar
                        key={j}
                        className={`text-base ${j < product.rating ? 'text-orange-500 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">({product.rating}/5)</span>
                </div>
                <p className="text-xl font-bold text-orange-600 mb-4">¢{product.price}</p>
                <motion.button
                  onClick={() => handleAddToCart(product)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal - Captivating, shareable design with spice-themed elements */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl" // Wider modal for immersive experience
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 z-10 text-gray-600 hover:text-gray-800 transition-colors duration-200 bg-white/80 rounded-full p-2 shadow-md"
                >
                  <FiX size={20} />
                </button>
                {selectedProduct && (
                  <div className="h-full flex">
                    {/* Left: Hero Image with overlay */}
                    <div className="relative w-1/2 bg-gradient-to-b from-orange-50 to-red-50 flex flex-col">
                      <motion.img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                      {/* Subtle spice overlay for theme */}
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent" />
                      {/* Category badge */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-4"
                      >
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/95 backdrop-blur-sm text-orange-600 shadow-lg">
                          <FiTag className="mr-2 w-4 h-4" />
                          {selectedProduct.category}
                        </span>
                      </motion.div>
                    </div>
                    {/* Right: Engaging Content */}
                    <div className="w-1/2 p-8 flex flex-col justify-between bg-gradient-to-b from-white to-orange-50">
                      <div>
                        <motion.h3 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-4xl font-bold text-gray-800 mb-4 leading-tight"
                        >
                          {selectedProduct.name}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-gray-600 mb-6 text-lg leading-relaxed"
                        >
                          {selectedProduct.description}
                        </motion.p>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center mb-6"
                        >
                          <div className="flex">
                            {[...Array(5)].map((_, j) => (
                              <FiStar
                                key={j}
                                className={`text-xl ${j < selectedProduct.rating ? 'text-orange-500 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="ml-3 text-sm text-gray-600 font-medium">({selectedProduct.rating}/5)</span>
                        </motion.div>
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-5xl font-bold text-orange-600 mb-8"
                        >
                          ¢{selectedProduct.price}
                        </motion.p>
                      </div>
                      {/* Engaging CTA Section */}
                      <div className="space-y-4">
                        {/* Video - Compact and integrated */}
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="mb-6"
                        >
                          <video
                            src={selectedProduct.video}
                            controls
                            className="w-full h-32 rounded-2xl object-cover shadow-md"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </motion.div>
                        {/* Share and Proceed Buttons */}
                        <div className="flex space-x-3">
                          <motion.button
                            onClick={handleShare}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
                          >
                            <FiShare2 className="w-5 h-5" />
                            <span>Share with Friends</span>
                          </motion.button>
                          <motion.button
                            onClick={handleProceedToOrder}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <FiPlay className="w-5 h-5" />
                            <span>Proceed to Order</span>
                          </motion.button>
                        </div>
                        {/* Trust badge */}
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-xs text-gray-500 text-center italic"
                        >
                          Trusted by 10k+ spice lovers • Fresh & Authentic
                        </motion.p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}