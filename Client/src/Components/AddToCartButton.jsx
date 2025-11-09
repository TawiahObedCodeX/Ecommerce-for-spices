import React, { useState, useRef } from 'react';
import { FaShoppingCart, FaBox, FaCheck, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Simple confetti component using Framer Motion
const Confetti = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
            initial={{ x: "50%", y: "50%", scale: 0 }}
            animate={{
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 1 + 0.5,
              ease: "easeOut",
            }}
            style={{
              left: "50%",
              top: "50%",
            }}
          />
        ))}
      </>
    )}
  </AnimatePresence>
);

const AddToCartButton = ({
  onAddToCart,
  productImage = "https://via.placeholder.com/80x80/4F46E5/FFFFFF?text=Item", // Default placeholder
  productName = "Cool Product",
  quantity = 1,
  className = "",
  disabled = false,
  isAuthenticated = false,
  onLoginRequired,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const buttonRef = useRef(null);
  const cartRef = useRef(null);

  const handleAddToCart = async () => {
    if (isAnimating || disabled) return;

    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    setIsAnimating(true);
    setShowConfetti(false);

    // Simulate async
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (onAddToCart) {
      onAddToCart({ productName, quantity });
    }

    setShowConfetti(true);
    setTimeout(() => {
      setIsAnimating(false);
      setShowConfetti(false);
    }, 1500);
  };

  const buttonVariants = {
    idle: {
      scale: 1,
      transition: { duration: 0.2 },
    },
    hover: { scale: 1.05, boxShadow: "0 10px 25px rgba(79, 70, 229, 0.3)" },
    tap: { scale: 0.95 },
    animating: { scale: 1 },
  };

  const flyVariants = {
    initial: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      x: 0,
      y: 0,
    },
    fly: {
      scale: [1, 0.8, 0.6],
      opacity: [1, 0.8, 0],
      rotate: [0, -180, 360],
      x: [0, -20, 40],
      y: [-10, 20, 0],
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom ease for bounce
      },
    },
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Pulsing Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400/20 to-blue-400/20 blur-xl opacity-0"
        animate={isAnimating ? "idle" : "hover"}
        variants={{
          hover: { opacity: 1, scale: 1.1 },
          idle: { opacity: 0 },
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.button
        ref={buttonRef}
        onClick={handleAddToCart}
        disabled={isAnimating || disabled || !isAuthenticated}
        variants={buttonVariants}
        whileHover={isAuthenticated ? "hover" : {}}
        whileTap={isAuthenticated ? "tap" : {}}
        animate={isAnimating ? "animating" : "idle"}
        className={`
          relative flex items-center justify-center font-bold rounded-xl
          shadow-xl focus:outline-none focus:ring-4 transition-all duration-300
          overflow-hidden border-0 w-16 h-16
          ${isAuthenticated
            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl focus:ring-purple-500/50 disabled:opacity-60 disabled:cursor-not-allowed before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:to-white/20 before:animate-shimmer before:opacity-0 hover:before:opacity-100'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }
        `}
        style={{ backgroundSize: "200% 100%" }}
        aria-label={isAuthenticated ? `Add ${productName} to cart` : 'Login required to add to cart'}
      >
        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <motion.div
          className="flex flex-col items-center space-y-1"
          animate={{ scale: isAnimating ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {isAuthenticated ? (
            <FaShoppingCart className="text-lg relative z-10" />
          ) : (
            <FaLock className="text-lg relative z-10" />
          )}
          <span className="relative z-10 text-xs text-center">
            {isAnimating ? (
              <>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Flying to Cart...
                </motion.span>
              </>
            ) : isAuthenticated ? (
              "Add to Cart"
            ) : (
              "Login Required"
            )}
          </span>
        </motion.div>

        {/* Flying Product */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              variants={flyVariants}
              initial="initial"
              animate="fly"
              exit="initial"
              className="absolute -top-4 -right-4"
              style={{ originX: 1, originY: 0 }}
            >
              <div className="relative bg-white/90 rounded-lg shadow-lg p-1 border border-gray-200">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-12 h-12 object-cover rounded"
                />
                <FaCheck className="absolute -top-0.5 -right-0.5 text-green-500 text-xs bg-white rounded-full p-0.5 shadow" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Cart Icon Overlay for Landing */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            ref={cartRef}
            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [ -180, 0, 360 ],
            }}
            transition={{
              scale: { duration: 0.4, ease: "backOut", times: [0, 0.5, 1] },
              rotate: { duration: 0.6, ease: "easeOut" },
            }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <FaShoppingCart className="text-indigo-600 text-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Burst */}
      <Confetti isVisible={showConfetti} />
    </div>
  );
};

export default AddToCartButton;