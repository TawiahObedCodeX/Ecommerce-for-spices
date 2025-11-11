// Updated ClientBrowserAdds.jsx - Displays products with clickable Add to Cart and modal, now with real-time updates via event listener
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiShoppingCart, FiX, FiPlay } from 'react-icons/fi';

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
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.7, transition: { duration: 0.2 } },
};

export default function ClientBrowserAdds() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Initial load from localStorage
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  // Real-time update listener for productAdded event
  useEffect(() => {
    const handleProductAdded = () => {
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts(storedProducts);
    };

    window.addEventListener('productAdded', handleProductAdded);

    return () => {
      window.removeEventListener('productAdded', handleProductAdded);
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

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">No Spices Available Yet</h1>
          <p className="text-lg text-gray-600">Check back soon for flavorful additions!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
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
              className="bg-white rounded-3xl overflow-hidden shadow-lg"
            >
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
                whileHover={{ scale: 1.05 }}
              />
              <div className="p-6">
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
                  <span className="ml-2 text-sm text-gray-600">({product.rating}/5)</span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mb-4">¢{product.price}</p>
                <motion.button
                  onClick={() => handleAddToCart(product)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold flex items-center justify-center space-x-2"
                >
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
                {selectedProduct && (
                  <>
                    <motion.img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-48 object-cover rounded-2xl mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
                    <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <FiStar
                            key={j}
                            className={`text-lg ${j < selectedProduct.rating ? 'text-orange-500 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">({selectedProduct.rating}/5)</span>
                    </div>
                    <div className="mb-4">
                      <video
                        src={selectedProduct.video}
                        controls
                        className="w-full rounded-2xl"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <motion.button
                      onClick={handleProceedToOrder}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center space-x-2"
                    >
                      <FiPlay />
                      <span>Proceed to Order</span>
                    </motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}