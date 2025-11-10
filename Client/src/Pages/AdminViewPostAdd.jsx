// AdminViewPostAdd.jsx - Displays products in cards for admin (Add to Cart disabled)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiX } from 'react-icons/fi';

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

export default function AdminViewPostAdd() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  if (products.length === 0) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">No Spices Added Yet</h1>
          <p className="text-lg text-gray-600">Head over to Add Product to spice things up!</p>
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
          Spice Inventory
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
                <button
                  disabled
                  className="w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-2xl font-semibold flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed"
                >
                  <FiShoppingCart />
                  <span>Add to Cart (Admin View)</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}