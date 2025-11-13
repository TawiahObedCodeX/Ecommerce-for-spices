// Updated ClientBrowserAdds.jsx - Improved flying animation smoothness with bezier easing, staged scale/rotate, and better path calculation for cart icon entry
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Check, Tag, Heart } from 'lucide-react'; // Use lucide where possible
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
export default function ClientBrowserAdds() {
  const [products, setProducts] = useState([]);
  const [addSuccess, setAddSuccess] = useState(null);
  const [flyingCard, setFlyingCard] = useState(null);
  const [soldOutProducts, setSoldOutProducts] = useState(new Set()); // Track sold out for animation
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
  // Real-time update listener for productsChanged and productsUpdated events
  useEffect(() => {
    const handleProductsChanged = async () => {
      try {
        const updatedProducts = await getProducts();
        // Detect sold out products for smooth UI transition
        const oldIds = new Set(products.map(p => p.id));
        const newIds = new Set(updatedProducts.map(p => p.id));
        const soldOut = [...oldIds].filter(id => !newIds.has(id));
        setSoldOutProducts(new Set(soldOut));
        setTimeout(() => setSoldOutProducts(new Set()), 2000); // Show "Sold Out" for 2s
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
  }, [products]);
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
    // Capture card rect for flying animation
    const cardRect = productRefs.current[index]?.getBoundingClientRect();
    // More accurate cart icon position (bottom navbar, 2nd tab, approx 1/7 width)
    const navbarHeight = 80;
    const cartIconWidth = 50;
    const cartIconX = (window.innerWidth / 7) * 2 - cartIconWidth / 2; // 2nd position
    const cartIconRect = {
      left: cartIconX,
      top: window.innerHeight - navbarHeight - cartIconWidth / 2,
      width: cartIconWidth,
      height: cartIconWidth
    };
    if (cardRect) {
      setFlyingCard({ product, index, startRect: cardRect, endRect: cartIconRect });
      setTimeout(() => setFlyingCard(null), 2000); // Extended for full animation cycle
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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-12 bg-linear-to-r from-secondary/80 via-amber/80 to-secondary/80 bg-clip-text text-transparent"
        >
          Browse Spice Delights
        </motion.h1>
        <motion.section 
          className=" px-4 md:px-8 lg:px-16 bg-background"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.article 
                key={product.id}
                ref={(el) => (productRefs.current[index] = el)}
                className={`group bg-card rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-700 border border-border hover:border-secondary/50 relative cursor-pointer ${soldOutProducts.has(product.id) ? 'grayscale opacity-50' : ''}`}
                variants={itemVariants}
                whileHover={{ y: -15, rotateX: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={(e) => {
                  if (e.target.closest('button')) return;
                }}
              >
                {/* Sold Out Badge */}
                {soldOutProducts.has(product.id) && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
                  >
                    Sold Out!
                  </motion.div>
                )}
                {/* Premium Badge */}
                {product.certified && !soldOutProducts.has(product.id) && (
                  <motion.div 
                    className="absolute top-4 left-4 z-10 bg-success text-text-dark px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
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
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Category Tag - Moved to top-left of image */}
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-secondary shadow-md"
                  >
                    <Tag className="mr-1 w-3 h-3" />
                    {product.category}
                  </motion.span>
                  <motion.div 
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <button className="bg-text-light/10 backdrop-blur-sm p-2 rounded-full hover:bg-info/20 shadow-md">
                      <Heart className="w-5 h-5 text-secondary" />
                    </button>
                    {!soldOutProducts.has(product.id) && (
                      <button 
                        onClick={() => handleAddToCart(product, index)}
                        className="bg-secondary/90 text-text-light p-2 rounded-full hover:bg-error shadow-md"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    )}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-light text-xs text-charcoal">{product.origin || 'Unknown'}</span>
                    <div className="flex text-success">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                      ))}
                      <span className="ml-1 text-xs font-medium">({product.rating})</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl text-text-dark mb-2 leading-tight group-hover:text-secondary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="font-light text-charcoal mb-4 h-12 overflow-hidden line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className={`font-bold text-2xl tracking-tight ${soldOutProducts.has(product.id) ? 'text-gray-400 line-through' : 'text-secondary'}`}>
                      ¢{product.price}
                    </span>
                    {!soldOutProducts.has(product.id) ? (
                      <motion.button
                        onClick={() => handleAddToCart(product, index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={addSuccess === product.id ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        className="px-4 py-2 bg-linear-to-r from-orange-500 to-red-500 text-text-light rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </motion.button>
                    ) : (
                      <span className="text-gray-500 text-sm font-medium">Sold Out</span>
                    )}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <motion.div 
                  className="absolute inset-0 rounded-3xl bg-linear-to-r from-info/10 to-success/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Flying Card Animation to Cart Icon - Smoother with bezier ease, staged transforms */}
        <AnimatePresence>
          {flyingCard && (
            <>
              <motion.div
                className="fixed z-50 pointer-events-none"
                initial={false}
                animate={{
                  x: flyingCard.endRect.left - flyingCard.startRect.left,
                  y: flyingCard.endRect.top - flyingCard.startRect.top,
                  scale: [1, 0.8, 0.3, 0],
                  opacity: [1, 1, 1, 0],
                  rotate: [0, 90, 180, 360],
                }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.25, 0.46, 0.45, 0.94], // Bezier for smooth curve
                  times: [0, 0.3, 0.7, 1] // Staged: hold scale, then shrink/rotate
                }}
                onAnimationComplete={() => {
                  // Trigger return glow/confirmation
                  setTimeout(() => {
                    setFlyingCard(prev => ({ ...prev, confirming: true }));
                  }, 150);
                }}
              >
                <div className="w-full h-full bg-card rounded-3xl overflow-hidden shadow-lg">
                  <img
                    src={flyingCard.product.image}
                    alt={flyingCard.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              {flyingCard.confirming && (
                <motion.div
                  className="fixed z-50 pointer-events-none"
                  initial={{
                    x: flyingCard.endRect.left - flyingCard.startRect.left,
                    y: flyingCard.endRect.top - flyingCard.startRect.top,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    scale: [0, 0.6, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, -180],
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 0.3
                  }}
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Check className="text-white w-8 h-8 animate-pulse" />
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
        {/* Success Toast */}
        <AnimatePresence>
          {addSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed top-4 right-4 bg-success text-text-light px-6 py-4 rounded-xl shadow-lg z-50 flex items-center space-x-2"
            >
              <Check size={20} />
              <span>Added to Cart!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}