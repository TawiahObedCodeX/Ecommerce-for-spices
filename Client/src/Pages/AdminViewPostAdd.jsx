// Updated AdminViewPostAdd.jsx - Integrated with backend API
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Edit, Trash2, X } from 'lucide-react';

const API_BASE = 'http://localhost:5005';

// Helper function for authenticated requests with token refresh
async function authenticatedFetch(url, options = {}) {
  let token = localStorage.getItem('adminToken');
  if (!token) {
    throw new Error('No admin token found');
  }

  const makeRequest = (authToken) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`,
      },
    });
  };

  let response = await makeRequest(token);

  // If token expired, try to refresh
  if (response.status === 401) {
    try {
      const refreshResponse = await fetch(`${API_BASE}/auth/admin/refresh`, {
        method: 'POST',
        credentials: 'include', // Include cookies for refresh token
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        localStorage.setItem('adminToken', refreshData.accessToken);
        token = refreshData.accessToken;

        // Retry the original request with new token
        response = await makeRequest(token);
      } else {
        throw new Error('Session expired. Please login again.');
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      throw new Error('Session expired. Please login again.');
    }
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}

async function getProducts() {
  const data = await authenticatedFetch(`${API_BASE}/admin/post/`);
  return data.products;
}

async function deleteProduct(id) {
  await authenticatedFetch(`${API_BASE}/admin/post/${id}`, {
    method: 'DELETE',
  });
}

async function updateProduct(product) {
  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('category', product.category);
  formData.append('description', product.description || '');
  formData.append('price', product.price);
  formData.append('rating', product.rating);

  const data = await authenticatedFetch(`${API_BASE}/admin/post/${product.id}`, {
    method: 'PUT',
    body: formData,
  });
  return data.product;
}
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
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
  // Initial load from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProducts();
        setProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);
  // Real-time update listener for productsChanged and productsUpdated events
  useEffect(() => {
    const handleProductsChanged = async () => {
      try {
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error updating products:', error);
      }
    };
    window.addEventListener('productsChanged', handleProductsChanged);
    window.addEventListener('productsUpdated', handleProductsChanged);
    return () => {
      window.removeEventListener('productsChanged', handleProductsChanged);
      window.removeEventListener('productsUpdated', handleProductsChanged);
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
      try {
        await deleteProduct(deleteConfirmId);
        setProducts((prev) => prev.filter((p) => p.id !== deleteConfirmId));
        // Trigger cross-tab and same-tab updates
        localStorage.setItem('productsUpdated', Date.now().toString());
        window.dispatchEvent(new Event('productsUpdated'));
        setDeleteConfirmId(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      try {
        const updatedProduct = await updateProduct({ ...editingProduct, ...formData });
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)));
        setIsEditModalOpen(false);
        setEditingProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product');
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center w-full max-w-md"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-dark mb-4">No Spices Added Yet</h1>
          <p className="text-base sm:text-lg text-charcoal">Head over to Add Product to spice things up!</p>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-8 bg-linear-to-r from-secondary/80 to-amber/80 bg-clip-text text-transparent"
        >
          Spice Inventory
        </motion.h1>
        <motion.section 
          className=" sm:py-12 py-7 px-2 sm:px-4 md:px-8 lg:px-16 bg-background"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <motion.article 
                key={product.id}
                className="group bg-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-700 border border-border hover:border-secondary/50 relative"
                variants={itemVariants}
                whileHover={{ y: -15, rotateX: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Premium Badge - Assuming certified field exists or default to false */}
                {product.certified && (
                  <motion.div 
                    className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 bg-success text-text-dark px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Certified Organic
                  </motion.div>
                )}

                {/* Image with Gradient Overlay */}
                <div className="relative overflow-hidden bg-linear-to-t from-background-dark/50 to-transparent">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Admin Edit and Delete Buttons on Hover - Stack vertically on small screens */}
                  <motion.div 
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col sm:flex-row gap-1 sm:gap-2 z-20"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <motion.button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-info/90 text-text-light p-1.5 sm:p-2 rounded-full hover:bg-info shadow-md shrink-0"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                    <motion.button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product.id);
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-error/90 text-text-light p-1.5 sm:p-2 rounded-full hover:bg-error shadow-md shrink-0"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
                    {/* Origin - Assuming origin field exists or default to '' */}
                    <span className="font-light text-xs text-charcoal order-2 sm:order-1">{product.origin || 'Unknown'}</span>
                    <div className="flex text-success order-1 sm:order-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                      ))}
                      <span className="ml-1 text-xs font-medium">({product.rating})</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg sm:text-xl text-text-dark mb-2 leading-tight group-hover:text-secondary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="font-light text-sm sm:text-base text-charcoal mb-4 h-12 overflow-hidden line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-bold text-xl sm:text-2xl text-secondary tracking-tight">
                      ¢{product.price}
                    </span>
                    {/* Disabled Add to Cart Button for Admin */}
                    <button
                      disabled
                      className="px-3 sm:px-4 py-2 bg-gray-300 text-gray-500 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed text-sm sm:text-base"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <motion.div 
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-linear-to-r from-info/10 to-success/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.article>
            ))}
          </div>
        </motion.section>

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
              <motion.div className="bg-card rounded-2xl p-4 sm:p-6 max-w-sm w-full">
                <h3 className="text-base sm:text-lg font-bold mb-4">Confirm Delete</h3>
                <p className="text-sm sm:text-base text-charcoal mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex space-x-3">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-2 px-4 bg-error text-text-light rounded-xl font-semibold text-sm sm:text-base"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2 px-4 bg-gray-300 text-text-dark rounded-xl font-semibold text-sm sm:text-base"
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
              <motion.div className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold">Edit Product</h3>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-1">
                    <X size={20} sm:size={24} />
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    className="w-full p-3 border rounded-xl border-border text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="w-full p-3 border rounded-xl border-border text-sm sm:text-base"
                  />
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    placeholder="Price"
                    className="w-full p-3 border rounded-xl border-border text-sm sm:text-base"
                  />
                  <select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-xl border-border text-sm sm:text-base"
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
                      <Star
                        key={star}
                        className={`cursor-pointer w-5 h-5 ${formData.rating >= star ? 'text-success fill-current' : 'text-gray-300'}`}
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      />
                    ))}
                  </div>
                  <button type="submit" className="w-full py-3 bg-secondary text-text-light rounded-xl font-bold text-sm sm:text-base">
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