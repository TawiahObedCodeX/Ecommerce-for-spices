// RoleSelector.jsx - Updated UI: More luxurious, centered cards with gradient accents and subtle animations
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming React Router for navigation

const RoleSelector = () => {
  const [hovered, setHovered] = useState(null);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: { 
      scale: 1.05, 
      y: -10,
      boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-white to-[var(--color-card)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Enhanced luxury background with subtle spice-themed gradients */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(220,20,60,0.03),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(34,139,34,0.03),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(80,200,120,0.03),transparent_50%)]"></div>
      </div>

      {/* Floating spice elements for luxury feel */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-[var(--color-secondary)]/10 rounded-full blur-xl animate-pulse delay-1000"></div>

      <motion.div 
        className="relative z-10 text-center max-w-4xl mx-auto w-full p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-12"
          variants={cardVariants}
        >
          <h1 className="font-playfair-display-bold text-6xl md:text-8xl text-[var(--color-text-dark)] mb-4 bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-accent)] to-[var(--color-success)] bg-clip-text text-transparent">
           Melo's Spice
          </h1>
          <p className="font-montserrat-medium text-xl text-[var(--color-charcoal)] max-w-lg mx-auto">
            Where premium flavors meet unparalleled sophistication. Choose your path to culinary excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <motion.div
            className="group relative overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHovered('client')}
            onHoverEnd={() => setHovered(null)}
          >
            <Link to="/clientform">
              <div className="bg-white rounded-3xl p-10 shadow-2xl border border-[var(--color-border)]/50 relative overflow-hidden cursor-pointer transition-all duration-500 hover:border-[var(--color-accent)]">
                {/* Gradient overlay on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/0 to-[var(--color-success)]/0 group-hover:from-[var(--color-accent)]/5 group-hover:to-[var(--color-success)]/5 rounded-3xl transition-all duration-500"
                />
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Client" 
                  className="w-24 h-24 mx-auto mb-6 rounded-3xl object-cover border-2 border-[var(--color-accent)]/50 shadow-lg relative z-10"
                />
                <h3 className="font-playfair-display-bold text-3xl text-[var(--color-text-dark)] mb-3 relative z-10">Client</h3>
                <p className="font-montserrat-regular text-[var(--color-charcoal)] relative z-10">Indulge in curated spices for your home.</p>
                {hovered === 'client' && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-[var(--color-accent)]/10 rounded-3xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="w-3 h-3 bg-[var(--color-success)] rounded-full animate-ping mr-1"></div>
                        <div className="w-3 h-3 bg-[var(--color-success)] rounded-full animate-ping mr-1 delay-150"></div>
                        <div className="w-3 h-3 bg-[var(--color-success)] rounded-full animate-ping delay-300"></div>
                      </div>
                      <p className="text-sm font-montserrat-medium text-[var(--color-text-dark)]">Ready to explore</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </Link>
          </motion.div>

          <motion.div
            className="group relative overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHovered('admin')}
            onHoverEnd={() => setHovered(null)}
          >
            <Link to="/adminform">
              <div className="bg-white rounded-3xl p-10 shadow-2xl border border-[var(--color-border)]/50 relative overflow-hidden cursor-pointer transition-all duration-500 hover:border-[var(--color-secondary)]">
                {/* Gradient overlay on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)]/0 to-[var(--color-burgundy)]/0 group-hover:from-[var(--color-secondary)]/5 group-hover:to-[var(--color-burgundy)]/5 rounded-3xl transition-all duration-500"
                />
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Admin" 
                  className="w-24 h-24 mx-auto mb-6 rounded-3xl object-cover border-2 border-[var(--color-secondary)]/50 shadow-lg relative z-10"
                />
                <h3 className="font-playfair-display-bold text-3xl text-[var(--color-text-dark)] mb-3 relative z-10">Admin</h3>
                <p className="font-montserrat-regular text-[var(--color-charcoal)] relative z-10">Empower your spice empire with precision.</p>
                {hovered === 'admin' && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-[var(--color-secondary)]/10 rounded-3xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="w-3 h-3 bg-[var(--color-text-dark)] rounded-full animate-ping mr-1"></div>
                        <div className="w-3 h-3 bg-[var(--color-text-dark)] rounded-full animate-ping mr-1 delay-150"></div>
                        <div className="w-3 h-3 bg-[var(--color-text-dark)] rounded-full animate-ping delay-300"></div>
                      </div>
                      <p className="text-sm font-montserrat-medium text-[var(--color-text-dark)]">Take control now</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Subtle footer text */}
        <motion.p 
          className="font-montserrat-light text-sm text-[var(--color-charcoal)] mt-8 opacity-75"
          variants={cardVariants}
        >
          Crafted for the discerning spice connoisseur
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RoleSelector;