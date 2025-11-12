// Updated ClientFloatingNavbar.jsx - No changes needed, already routes Payment tab to payment page
import React, { useState, useEffect } from "react";
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
  const updateCounts = () => {
    const storeCount = parseInt(localStorage.getItem('clientNewProducts') || '0');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setStoreNotificationCount(storeCount);
    setCartNotificationCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
  };
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    updateCounts();
    // Listen for product added event
    window.addEventListener('productAdded', updateCounts);
    // Listen for cart updated event
    window.addEventListener('cartUpdated', updateCounts);
    // Listen for localStorage changes in other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart' || e.key === 'clientNewProducts') {
        updateCounts();
      }
    });
    // Poll every 2 seconds for same-tab updates (fallback)
    const interval = setInterval(updateCounts, 2000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('productAdded', updateCounts);
      window.removeEventListener('cartUpdated', updateCounts);
      window.removeEventListener('storage', (e) => {
        if (e.key === 'cart' || e.key === 'clientNewProducts') {
          updateCounts();
        }
      });
      clearInterval(interval);
    };
  }, []);
  const tabs = [
    { icon: MdStorefront, name: "Store", route: "/dashbord-client", hasNotification: true },
    { icon: MdShoppingCart, name: "Cart", route: "/dashbord-client/addtocart", hasNotification: true },
    { icon: MdPayment, name: "Payment", route: "/dashbord-client/paymenttoadmin" },
    { icon: MdChatBubbleOutline, name: "Chat" },
    { icon: MdTrackChanges, name: "Track", route: "/dashbord-client/trackmyorder" },
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
    }
  };
  const getNotificationCount = (index) => {
    if (index === 0) return storeNotificationCount;
    if (index === 1) return cartNotificationCount;
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
          return (
            <motion.button
              key={index}
              onClick={() => handleTabClick(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
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