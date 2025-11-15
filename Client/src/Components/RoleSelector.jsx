// RoleSelector.jsx - Revamped UI: Clean white background, vibrant accents, compact layout to fit viewport, engaging micro-interactions for a fresh, inviting vibe
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming React Router for navigation

const RoleSelector = () => {
  const [isClientHovered, setIsClientHovered] = useState(false);
  const [isAdminHovered, setIsAdminHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    hover: {
      scale: 1.05,
      y: -8,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const overlayVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 1.1, transition: { duration: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Subtle white-on-white texture for depth without overwhelming */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,193,7,0.02),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.02),transparent_50%)]"></div>

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto w-full h-full flex flex-col justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Compact Hero Title */}
        <motion.div variants={titleVariants} className="mb-6">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl mb-3 bg-linear-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent leading-tight">
            Melo's Spice
          </h1>
          <motion.p
            variants={subtitleVariants}
            className="font-sans text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed px-2"
          >
            Elevate your flavors. Choose your path to spice mastery.
          </motion.p>
        </motion.div>

        {/* Compact Role Cards Grid - Fits viewport */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto mb-6">
          {/* Client Card - Vibrant, inviting */}
          <motion.div
            className="group relative"
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setIsClientHovered(true)}
            onHoverEnd={() => setIsClientHovered(false)}
          >
            <Link to="/clientform" className="block h-full">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-amber-100 relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-amber-300 h-full flex flex-col justify-between">
                {/* Subtle accent overlay */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-br from-amber-50/50 via-transparent to-red-50/50 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Image */}
                <motion.img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Client - Home Chef"
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl object-cover border-2 border-amber-200 shadow-sm relative z-10 group-hover:border-amber-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <h3 className="font-serif text-xl sm:text-2xl text-gray-900 mb-2">Home Connoisseur</h3>
                  <p className="font-sans text-gray-600 text-xs sm:text-sm leading-relaxed flex-1">
                    Curated spices for your kitchen. Fresh, bold, yours.
                  </p>
                </div>
                {/* Hover Overlay */}
                <AnimatePresence>
                  {isClientHovered && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-amber-50/80 rounded-2xl"
                      variants={overlayVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <div className="text-center">
                        <p className="text-xs font-semibold text-amber-700">Start savoring</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          </motion.div>

          {/* Admin Card - Professional, empowering */}
          <motion.div
            className="group relative"
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setIsAdminHovered(true)}
            onHoverEnd={() => setIsAdminHovered(false)}
          >
            <Link to="/adminform" className="block h-full">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-emerald-100 relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-emerald-300 h-full flex flex-col justify-between">
                {/* Subtle accent overlay */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-br from-emerald-50/50 via-transparent to-teal-50/50 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Image */}
                <motion.img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Admin - Spice Master"
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl object-cover border-2 border-emerald-200 shadow-sm relative z-10 group-hover:border-emerald-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <h3 className="font-serif text-xl sm:text-2xl text-gray-900 mb-2">Spice Artisan</h3>
                  <p className="font-sans text-gray-600 text-xs sm:text-sm leading-relaxed flex-1">
                    Build and manage your spice world. Tools that empower.
                  </p>
                </div>
                {/* Hover Overlay */}
                <AnimatePresence>
                  {isAdminHovered && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-emerald-50/80 rounded-2xl"
                      variants={overlayVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <div className="text-center">
                        <p className="text-xs font-semibold text-emerald-700">Lead the way</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Compact footer - No extra space */}
        <motion.p
          className="font-sans text-xs text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          Crafted for flavor enthusiasts ✨
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RoleSelector;