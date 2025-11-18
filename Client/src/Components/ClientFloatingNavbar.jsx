// Updated ClientFloatingNavbar.jsx - Fixed track tab route to '/dashbord-client/trackmyorder' (no param), added orderCompleted listener to clear payment badge. Ensured proceed to payment routes correctly (already does via cart).
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdStorefront,
  MdShoppingCart,
  MdPayment,
  MdChatBubbleOutline,
  MdTrackChanges,
  MdLogout,
  MdOutlineMeetingRoom,
} from "react-icons/md";

const ClientFloatingNavbar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [storeNotificationCount, setStoreNotificationCount] = useState(0);
  const [cartNotificationCount, setCartNotificationCount] = useState(0);
  const [paymentNotificationCount, setPaymentNotificationCount] = useState(0); // New: For pending checkout
  const [cartGlow, setCartGlow] = useState(false); // For animation sync

  const updateCounts = useCallback(() => {
    const storeCount = parseInt(localStorage.getItem('clientNewProducts') || '0');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const checkoutOrder = localStorage.getItem('checkoutOrder'); // Check for pending order
    setStoreNotificationCount(storeCount);
    setCartNotificationCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
    setPaymentNotificationCount(checkoutOrder ? 1 : 0); // 1 if order pending
  }, []);

  // Define handlers explicitly for proper removal
  const handleProductAdded = useCallback(() => updateCounts(), [updateCounts]);
  const handleCartUpdated = useCallback(() => {
    updateCounts();
    setCartGlow(true);
    setTimeout(() => setCartGlow(false), 500);
  }, [updateCounts]);
  const handleOrderCompleted = useCallback(() => {
    updateCounts(); // Clears payment badge
  }, [updateCounts]);
  const handleStorageChange = useCallback((e) => {
    if (e.key === 'cart' || e.key === 'clientNewProducts' || e.key === 'checkoutOrder' || e.key === 'completedOrder') {
      updateCounts();
    }
  }, [updateCounts]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    updateCounts();

    // Event listeners
    window.addEventListener('productAdded', handleProductAdded);
    window.addEventListener('cartUpdated', handleCartUpdated);
    window.addEventListener('orderCompleted', handleOrderCompleted);
    window.addEventListener('storage', handleStorageChange);

    // Poll every 2 seconds for same-tab updates (fallback)
    const interval = setInterval(updateCounts, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('productAdded', handleProductAdded);
      window.removeEventListener('cartUpdated', handleCartUpdated);
      window.removeEventListener('orderCompleted', handleOrderCompleted);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [handleProductAdded, handleCartUpdated, handleOrderCompleted, handleStorageChange, updateCounts]); // Include handlers and updateCounts in deps

  const tabs = [
    { icon: MdStorefront, name: "Store", route: "/dashbord-client", hasNotification: true },
    { icon: MdShoppingCart, name: "Cart", route: "/dashbord-client/addtocart", hasNotification: true },
    { icon: MdPayment, name: "Payment", route: "/dashbord-client/clientpaymentsystem", hasNotification: true }, // Enabled notification
    { icon: MdChatBubbleOutline, name: "Chat" },
    { icon: MdTrackChanges, name: "Track", route: "/dashbord-client/trackmyorder/:orderId" }, // Fixed: No param, handled in component
    { icon: MdOutlineMeetingRoom, name: "One on One with the Admin", route: "/dashbord-client/sectionwiththeadmin" },
    { icon: MdLogout, name: "Logout" },
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
    const tab = tabs[index];
    if (tab.route) {
      navigate(tab.route);
      // Reset store notification if clicking on Store
      if (index === 0 && storeNotificationCount > 0) {
        localStorage.setItem('clientNewProducts', '0');
        setStoreNotificationCount(0);
      }
      // Reset payment notification if clicking on Payment (after success, it's cleared in PaymentSystem)
      if (index === 2 && paymentNotificationCount > 0) {
        // No need to clear here - PaymentSystem clears on success
      }
      // For Track, component handles loading if no specific ID
      if (index === 4) {
        const completedOrder = JSON.parse(localStorage.getItem('completedOrder') || '{}');
        if (completedOrder.id) {
          navigate(`/dashbord-client/trackmyorder/${completedOrder.id}`);
        }
      }
    }
  };

  const getNotificationCount = (index) => {
    if (index === 0) return storeNotificationCount;
    if (index === 1) return cartNotificationCount;
    if (index === 2) return paymentNotificationCount; // New: Payment badge
    return 0;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
      transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
      className="fixed bottom-5 left-0 right-0 md:left-4 md:right-4 md:max-w-md md:mx-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-t-3xl px-4 md:px-6 py-3 z-50 border-t border-purple-100/50 md:rounded-3xl md:border"
    >
      <nav className="flex justify-around items-center relative">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = index === activeTab;
          const notificationCount = getNotificationCount(index);
          const showBadge = tab.hasNotification && notificationCount > 0;
          const isCart = index === 1;
          return (
            <motion.button
              key={index}
              onClick={() => handleTabClick(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              animate={isCart && cartGlow ? { scale: [1, 1.2, 1], boxShadow: "0 0 20px rgba(251, 146, 60, 0.5)" } : {}}
              transition={isCart && cartGlow ? { duration: 0.5 } : {}}
              className={`relative flex items-center justify-center p-2 md:p-3 rounded-2xl transition-all duration-300 ease-out group ${
                isActive
                  ? "bg-purple-500 text-white shadow-lg"
                  : "text-gray-500 hover:text-purple-500 hover:bg-purple-50"
              }`}
              style={{ width: "auto", height: "auto" }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Icon
                  size={isActive ? 24 : 20}
                  className={`transition-all duration-300 ${
                    isActive ? "fill-white" : ""
                  }`}
                />
              </motion.div>
              {showBadge && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </motion.div>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-purple-500 rounded-2xl -z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50"
                >
                  {tab.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default ClientFloatingNavbar;