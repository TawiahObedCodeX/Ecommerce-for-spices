// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; // Install framer-motion for smooth animations
import spices from "../assets/spices1.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const fadeInUpDelayedVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function HeroSection() {
  return (
    <div className="bg-gray-200 min-h-[90vh] w-full flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
      <motion.div
        className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-14"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left: Text Content */}
        <motion.div 
          className="flex flex-col gap-4 sm:gap-5 md:gap-6 text-center lg:text-left flex-1 order-2 lg:order-1"
        >
          <motion.h1 
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800"
            variants={fadeInUpVariants}
          >
            Health Spices Product
          </motion.h1>
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-montserrat-extra-light-italic text-gray-900 leading-relaxed sm:leading-tight lg:leading-tight"
            variants={slideInLeftVariants}
          >
            Melo' NaturalSpices <br className="hidden sm:block lg:block"/> organic Product
          </motion.h1>
          <motion.button 
            className="bg-black hover:bg-gray-800 text-white w-full lg:w-[20vw] h-10 sm:h-12 md:h-14 lg:h-[10vh] rounded-lg text-sm sm:text-base md:text-lg lg:text-xl font-montserrat-extra-light-italic cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mx-auto lg:mx-0"
            variants={fadeInUpDelayedVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now
          </motion.button>
        </motion.div>
        
        {/* Right: Image */}
        <motion.div 
          className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-full order-1 lg:order-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          <motion.img
            src={spices}
            alt="Melo's Organic Spices Product"
            className="w-full h-auto rounded-lg object-cover"
            initial={{ scale: 0.95, rotate: -1 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.02, rotate: 1, transition: { duration: 0.3, ease: "easeOut" } }}
          />
        </motion.div>
      </motion.div>

      {/* Subtle background animation elements for smooth, professional depth - Responsive positioning */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-10 sm:top-16 left-4 sm:left-8 w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 rounded-full mix-blend-multiply filter blur-xl opacity-40 sm:opacity-50 bg-gradient-to-br from-amber-200 to-orange-300 hidden md:block"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            y: { duration: 4 },
            scale: { duration: 4 },
            rotate: { duration: 12 }
          }}
        />
        <motion.div 
          className="absolute bottom-10 sm:bottom-16 right-4 sm:right-8 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full mix-blend-multiply filter blur-xl opacity-40 sm:opacity-50 bg-gray-400 hidden md:block"
          animate={{ 
            y: [0, 20, 0],
            x: [-5, 5, -5],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1,
            y: { duration: 5 },
            x: { duration: 6, repeat: Infinity }
          }}
        />
        {/* Additional subtle floating element for more depth - Only on larger screens */}
        <motion.div 
          className="absolute top-1/2 left-1/4 w-12 sm:w-16 h-12 sm:h-16 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30 bg-gradient-to-br from-green-200 to-emerald-300 hidden lg:block"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            ease: "easeInOut",
            y: { duration: 4.5 },
            opacity: { duration: 9 }
          }}
        />
        {/* Simplified floating element for small screens */}
        <motion.div 
          className="absolute top-1/4 left-1/2 w-16 h-16 rounded-full mix-blend-multiply filter blur-xl opacity-30 bg-gradient-to-br from-amber-100 to-orange-200 md:hidden"
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}