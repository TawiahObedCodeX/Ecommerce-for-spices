// Updated AdminViewPostAdd.jsx - Added localStorage trigger and event dispatch on delete for real-time sync across tabs
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiShoppingCart, FiEdit3, FiTrash2, FiX } from 'react-icons/fi';
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
async function deleteProduct(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
async function updateProduct(product) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(product);
    request.onsuccess = () => resolve();
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
};
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};
export default function AdminViewPostAdd() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState({});
  // Initial load from IndexedDB
  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);
  // Real-time update listener for productAdded event
  useEffect(() => {
    const handleProductAdded = async () => {
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    };
    window.addEventListener('productAdded', handleProductAdded);
    return () => {
      window.removeEventListener('productAdded', handleProductAdded);
    };
  }, []);
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsEditModalOpen(true);
  };
  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };
  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteProduct(deleteConfirmId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteConfirmId));
      // Trigger cross-tab and same-tab updates
      localStorage.setItem('productsUpdated', Date.now().toString());
      window.dispatchEvent(new Event('productsUpdated'));
      setDeleteConfirmId(null);
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await updateProduct({ ...editingProduct, ...formData });
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p)));
      setIsEditModalOpen(false);
      setEditingProduct(null);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
              className="bg-white rounded-3xl overflow-hidden shadow-lg relative"
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
                  <span className="ml-2 text-sm text-gray-600"></span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mb-4">¢{product.price}</p>
                <button
                  disabled
                  className="w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-2xl font-semibold flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed"
                >
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </button>
                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <motion.button
                    onClick={() => handleEdit(product)}
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center space-x-1 text-sm"
                  >
                    <FiEdit3 />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(product.id)}
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 py-2 px-3 bg-red-500 text-white rounded-xl font-semibold flex items-center justify-center space-x-1 text-sm"
                  >
                    <FiTrash2 />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirmId && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex space-x-3">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-2 px-4 bg-red-500 text-white rounded-xl font-semibold"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Edit Modal */}
        <AnimatePresence>
          {isEditModalOpen && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Edit Product</h3>
                  <button onClick={() => setIsEditModalOpen(false)}>
                    <FiX size={24} />
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    className="w-full p-3 border rounded-xl"
                  />
                  <input
                    type="text"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="w-full p-3 border rounded-xl"
                  />
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    placeholder="Price"
                    className="w-full p-3 border rounded-xl"
                  />
                  <select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-xl"
                  >
                    <option value="">Category</option>
                    <option>Powders</option>
                    <option>Whole Spices</option>
                    <option>Blends</option>
                    <option>Herbs</option>
                    <option>Seasonings</option>
                  </select>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`cursor-pointer ${formData.rating >= star ? 'text-orange-500 fill-current' : 'text-gray-300'}`}
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      />
                    ))}
                  </div>
                  <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold">
                    Update Product
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}