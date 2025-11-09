// AdminFloatingNavbar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdAddCircleOutline,
  MdViewList,
  MdAnalytics,
  MdMessage,
  MdLocalShipping,
  MdChatBubbleOutline,MdLogout
} from 'react-icons/md';

const AdminFloatingNavbar = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { icon: MdAddCircleOutline, name: 'Add' },
    { icon: MdViewList, name: 'View' },
    { icon: MdAnalytics, name: 'Analytics' },
    { icon: MdMessage, name: 'Message' },
    { icon: MdLocalShipping, name: 'Shipping' },
    { icon: MdChatBubbleOutline, name: 'Chat' },
    { icon: MdLogout, name: 'Logout' },
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
    // Integrate with your navigation here, e.g., useNavigate from react-router-dom
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
      className="fixed  bottom-40 left-0 right-0 md:left-4 md:right-4 md:max-w-md md:mx-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-t-3xl px-4 md:px-6 py-3 z-50 border-t border-gray-200/50 md:rounded-3xl md:border"
    >
      <nav className="flex justify-around items-center relative">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = index === activeTab;
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
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-500 hover:text-purple-500 hover:bg-purple-50'
              }`}
              style={{ width: 'auto', height: 'auto' }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Icon
                  size={isActive ? 24 : 20}
                  className={`transition-all duration-300 ${isActive ? 'fill-white' : ''}`}
                />
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-purple-500 rounded-2xl -z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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

export default AdminFloatingNavbar;