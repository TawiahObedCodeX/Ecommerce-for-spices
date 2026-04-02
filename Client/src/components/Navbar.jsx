import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/products" },
    { name: "Our Story", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled ? "py-4" : "py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The White/Glass Container ensures Navbar stays readable regardless of Carousel colors */}
        <div className={`relative flex justify-between items-center px-6 sm:px-8 py-4 rounded-[2.5rem] transition-all duration-500 border ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-2xl border-stone-100 shadow-orange-900/10"
            : "bg-white border-white shadow-lg shadow-orange-900/5"
        }`}>

          {/* Logo - Always visible and responsive */}
          <Link to="/" className="group flex items-center space-x-2 flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#2D1606] rounded-xl flex items-center justify-center text-orange-400 font-serif font-bold text-xl transition-transform group-hover:rotate-12">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif font-black text-[#2D1606] leading-none">MELO'S</span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-orange-600 uppercase">Artisan</span>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile, shown from lg */}
          <div className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-orange-600 ${
                  isActive ? "text-orange-600" : "text-[#2D1606]/70"
                }`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* User Icon - Hidden on small mobile, shown from md */}
            {/* <Link 
              to="/signup" 
              className="hidden md:flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-stone-100 text-[#2D1606] hover:bg-[#2D1606] hover:text-white transition-all"
            >
              <FiUser size={18} />
            </Link> */}

            {/* Cart Icon - Always visible with dynamic count */}
            <Link 
              to="/cart" 
              className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2D1606] text-white shadow-lg hover:bg-orange-600 transition-all"
            >
              <FiShoppingBag size={18} />
              <span className="absolute -top-1 -right-1 bg-orange-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                {cartCount}
              </span>
            </Link>

            {/* Mobile Menu Button - Only on mobile & tablet */}
            <button 
              onClick={() => setMobileMenu(!mobileMenu)} 
              className="lg:hidden p-2 text-[#2D1606] hover:text-orange-600 transition-colors"
            >
              {mobileMenu ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Full responsive with smooth animation */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-stone-100 shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) => `text-lg font-black uppercase tracking-widest transition-all py-2 ${
                    isActive ? "text-orange-600" : "text-[#2D1606]"
                  }`}
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Mobile-only User Link */}
              {/* <Link 
                to="/signup" 
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 text-lg font-medium text-[#2D1606] pt-4 border-t border-stone-100"
              >
                <FiUser size={22} /> Account
              </Link> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;