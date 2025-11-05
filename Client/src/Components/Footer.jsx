// Footer.jsx - Updated for professional light gray theme
import { motion } from 'framer-motion';

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.15
    }
  }
};

const linkVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: { 
    x: 10,
    scale: 1.08,
    color: "#6b7280", // Subtle gray hover
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-100 text-gray-800 py-12 px-4 mt-28 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden" // Light gray background, dark text
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20%" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {/* Company Info */}
        <motion.div variants={linkVariants}>
          <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900"> {/* Darker for heading */}
            <span className="mr-2">🌿</span>
            Melo' Natural Spices
          </h3>
          <p className="text-sm text-gray-600 mb-4"> {/* Softer gray for body */}
            Discover the finest organic spices sourced from nature's bounty. Elevate your meals with health and flavor.
          </p>
          <div className="flex space-x-4">
            {['Facebook', 'Instagram', 'Twitter'].map((social) => (
              <motion.a
                key={social}
                href="#"
                className="text-gray-600 hover:text-gray-800 transition-colors" // Gray icons with darker hover
                variants={linkVariants}
                whileHover="hover"
              >
                <span className="text-xl">
                  {social === 'Facebook' ? '📘' : social === 'Instagram' ? '📷' : '🐦'}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={linkVariants}>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
          {['Home', 'Shop', 'About Us', 'Contact'].map((link) => (
            <motion.a
              key={link}
              href="#"
              className="block text-sm  hover:text-gray-900 py-1" // Gray to dark on hover
              variants={linkVariants}
              whileHover="hover"
            >
              {link}
            </motion.a>
          ))}
        </motion.div>

        {/* Categories */}
        <motion.div variants={linkVariants}>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">Spice Categories</h4>
          {['Powders', 'Whole Spices', 'Blends', 'Herbs'].map((cat) => (
            <motion.a
              key={cat}
              href="#"
              className="block text-sm text-gray-600 hover:text-gray-900 py-1"
              variants={linkVariants}
              whileHover="hover"
            >
              {cat}
            </motion.a>
          ))}
        </motion.div>

        {/* Newsletter */}
        <motion.div variants={linkVariants}>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">Stay Spiced</h4>
          <p className="text-sm text-gray-600 mb-4">Subscribe for exclusive recipes and offers.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-gray-300" // Professional input styling
            />
            <motion.button
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-r-lg font-semibold" // Neutral gray button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        className="border-t border-gray-300 mt-8 pt-6 text-center text-sm text-gray-500" // Light border, softer text
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p>&copy; 2025 Melo' Natural Spices. All rights reserved. | Crafted with ❤️ and spices.</p>
      </motion.div>

      {/* Subtle floating elements - Neutral grays for professionalism */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10"> {/* Much subtler */}
        <motion.div 
          className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-gray-300"
          animate={{ y: [0, -20, 0], rotate: [0, 360, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-10 w-6 h-6 rounded-full bg-gray-400"
          animate={{ y: [0, 20, 0], rotate: [360, 0, 360] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div 
          className="absolute top-3/4 left-1/4 w-10 h-10 rounded-full bg-gray-200"
          animate={{ x: [-10, 10, -10], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.footer>
  );
};

export default Footer;