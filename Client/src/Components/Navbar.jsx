import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const Navlink = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Products", link: "/product" },
    { label: "Contact", link: "/contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", delay: 0.3 }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      y: -100,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 w-full h-[12vh] min-h-[60px] bg-background/95 backdrop-blur-md border-b border-border shadow-sm flex justify-between items-center px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 z-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo - Enhanced responsive sizing across all breakpoints */}
        <motion.div 
          className="font-playfair-display-italic text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-text-dark hover:scale-105 transition-transform duration-300 cursor-pointer "
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          Melos Organic Spices
        </motion.div>

        {/* Desktop Nav Links - Responsive with flex-wrap and adjusted gaps for smaller widths */}
        <motion.div 
          className="hidden md:flex flex-1 justify-center mx-2 md:mx-4 lg:mx-6 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-montserrat-medium text-text-dark"
          variants={containerVariants}
        >
          <div className="flex flex-row gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6 2xl:gap-8 items-center flex-wrap justify-center">
            {Navlink.map((item, index) => (
              <motion.div key={index} variants={linkVariants}>
                <Link
                  to={item.link}
                  className="px-1 py-0.5 sm:px-2 md:px-3 lg:px-4 xl:px-5 2xl:px-6 rounded-lg hover:text-accent underline-offset-8 decoration-2 hover:decoration-accent transition-all duration-300 group whitespace-nowrap text-center font-playfair-display-semi-bold"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Desktop Buttons - Responsive stacking on smaller md screens if needed, but flex-row with smaller gaps */}
        <motion.div 
          className="hidden md:flex flex-row items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 "
          variants={buttonVariants}
        >
          <motion.button 
            className="bg-secondary text-white rounded-lg px-2 py-3 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-7 hover:bg-accent hover:scale-105 transition-all duration-300 shadow-md btn-glow font-playfair-display-bold-italic text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
          <motion.button 
            className="border-2 border-accent text-accent rounded-lg px-2 py-3 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-7 hover:bg-accent hover:text-white transition-all duration-300 shadow-md btn-glow font-playfair-display-bold-italic text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </motion.div>

        {/* Mobile Hamburger Menu - Enhanced sizing for all small screens */}
        <div className="md:hidden flex items-center relative">
          <motion.button
            onClick={toggleMenu}
            className={`focus:outline-none transition-all duration-300 ${isOpen ? 'hamburger-open text-secondary' : 'text-text-dark hover:scale-110'}`}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                initial={false}
                animate={{ pathLength: isOpen ? [0.7, 1] : [0, 1] }}
                transition={{ duration: 0.3 }}
              />
            </svg>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full-screen overlay, responsive padding and spacing for portrait/landscape */}
      <motion.div 
        className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-md flex flex-col justify-center items-center py-2 sm:py-4 md:py-6 space-y-2 sm:space-y-3 lg:space-y-4 z-40 overflow-y-auto"
        variants={mobileMenuVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "exit"}
      >
        <div className="flex flex-col items-center space-y-2 sm:space-y-3 w-full max-w-md px-4 sm:px-6 lg:px-8">
          {Navlink.map((item, index) => (
            <motion.div key={index} variants={linkVariants}>
              <Link
                to={item.link}
                onClick={() => setIsOpen(false)}
                className="text-text-dark text-sm sm:text-base md:text-lg font-montserrat-semibold hover:text-secondary hover:scale-110 transition-all duration-300 px-4 py-3 sm:py-3 lg:py-5 rounded-full hover:bg-accent/20 w-full max-w-xs text-center block"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="flex flex-col items-center space-y-1 sm:space-y-2 w-full max-w-xs px-4 sm:px-6"
          variants={buttonVariants}
        >
          <motion.button 
            className="w-full bg-secondary text-white rounded-lg py-2 sm:py-3 lg:py-4 hover:bg-accent hover:scale-105 transition-all duration-300 shadow-md btn-glow  text-sm sm:text-base md:text-lg font-playfair-display-bold-italic"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
          <motion.button 
            className="w-full border-2 border-accent text-accent rounded-lg py-2 sm:py-3 lg:py-4 hover:bg-accent hover:text-white transition-all duration-300 shadow-md btn-glow font-montserrat-semibold text-sm sm:text-base md:text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
}