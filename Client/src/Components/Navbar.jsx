import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const Navlink = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Products", link: "/product" },
    { label: "Contact", link: "/contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <style jsx>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes subtleGlow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(243, 154, 1, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(243, 154, 1, 0.5);
          }
        }
        @keyframes rotateHamburger {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(90deg);
          }
        }
        .navbar-enter {
          animation: slideInDown 0.6s ease-out forwards;
        }
        .link-stagger {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        .link-stagger:nth-child(1) { animation-delay: 0.1s; }
        .link-stagger:nth-child(2) { animation-delay: 0.2s; }
        .link-stagger:nth-child(3) { animation-delay: 0.3s; }
        .link-stagger:nth-child(4) { animation-delay: 0.4s; }
        .hamburger-open {
          animation: rotateHamburger 0.3s ease-in-out;
        }
        .btn-glow:hover {
          animation: subtleGlow 1.5s infinite;
        }
        .mobile-menu-slide {
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .mobile-menu-open {
          transform: translateX(0);
        }
      `}</style>
      <nav className="fixed top-0 left-0 w-full h-[10vh] bg-background border-b border-border shadow-sm flex justify-between items-center px-4 md:px-8 z-50 navbar-enter">
        {/* Logo - Professional with Playfair Display for elegance */}
        <div className="font-playfair-display-bold text-xl md:text-2xl text-text-dark hover:scale-105 transition-transform duration-300 cursor-pointer">
          Melos Organic Spices
        </div>

        {/* Desktop Nav Links - Subtle underline on hover, Montserrat for clean readability */}
        <div className="hidden md:flex flex-row gap-8 items-center text-lg font-montserrat-medium text-text-dark">
          {Navlink.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="hover:text-secondary hover:scale-105 transition-all duration-300 relative group link-stagger"
            >
              <span className="relative">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Desktop Buttons - Signup: Filled secondary orange for primary CTA; Login: Outlined accent yellow for secondary */}
        <div className="hidden md:flex flex-row items-center gap-4">
          <button className="bg-secondary text-text-dark rounded-lg px-6 py-2 hover:bg-accent hover:scale-105 transition-all duration-300 shadow-md btn-glow font-montserrat-semibold">
            Sign Up
          </button>
          <button className="border-2 border-accent text-accent rounded-lg px-6 py-2 hover:bg-accent hover:text-text-dark transition-all duration-300 shadow-md btn-glow font-montserrat-semibold">
            Login
          </button>
        </div>

        {/* Mobile Hamburger Menu - Subtle rotation */}
        <div className="md:hidden flex items-center relative">
          <button
            onClick={toggleMenu}
            className={`focus:outline-none transition-all duration-300 ${isOpen ? 'hamburger-open text-secondary' : 'text-text-dark hover:scale-110'}`}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Sidebar with theme colors, Montserrat for consistency */}
        <div className={`md:hidden fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl mobile-menu-slide ${isOpen ? 'mobile-menu-open' : ''} z-40`}>
          <div className="flex flex-col items-center justify-center h-full py-8 space-y-6">
            {Navlink.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                onClick={() => setIsOpen(false)}
                className="text-text-dark text-xl font-montserrat-semibold hover:text-secondary hover:scale-105 transition-all duration-300 link-stagger"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col items-center space-y-3 pt-4 border-t border-border w-full px-4">
              <button className="w-full bg-secondary text-text-dark rounded-lg py-3 hover:bg-accent hover:scale-105 transition-all duration-300 shadow-md btn-glow font-montserrat-semibold">
                Sign Up
              </button>
              <button className="w-full border-2 border-accent text-accent rounded-lg py-3 hover:bg-accent hover:text-text-dark transition-all duration-300 shadow-md btn-glow font-montserrat-semibold">
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </nav>
    </>
  );
}