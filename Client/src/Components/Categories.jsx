import { GrStar } from "react-icons/gr";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiTruck, FiShield, FiClock, FiArrowRight } from 'react-icons/fi'; // Added more icons
import AddToCartButton from './AddToCartButton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const slideInRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Modern Card Component with subtle lift on hover
function ModernCard({ children, className, variants, style = {}, ...props }) {
  return (
    <motion.div
      className={`bg-white/80 backdrop-blur-sm border border-gray-100/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
      style={{ ...style }}
      variants={variants}
      initial="hidden"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Updated Trust Indicators with modern styling
function TrustIndicators() {
  const indicators = [
    { icon: FiShield, text: '100% Organic Certified', color: '#10B981' },
    { icon: FiTruck, text: 'Free Delivery on Orders Over GH₵150', color: '#3B82F6' },
    { icon: FiClock, text: 'Guaranteed Freshness Within 48 Hours', color: '#84CC16' }
  ];

  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-4 mt-8 mb-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {indicators.map((indicator, index) => (
        <motion.div 
          key={index}
          className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl shadow-sm border-l-4"
          style={{ borderLeftColor: indicator.color }}
          variants={itemVariants}
        >
          <indicator.icon className="text-lg" style={{ color: indicator.color }} />
          <span className="font-montserrat-medium text-sm text-gray-700">
            {indicator.text}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function Categories() {
  const [isAuthenticated] = useState(false); // Mock authentication state

  // Mock login handler
  const handleLoginRequired = () => {
    // Redirect to client auth page for signup or login
    window.location.href = '/clientauth';
  };

  // Refined data with modern, concise details
  const categories = [
    { title: 'Exotic Blends', desc: 'Global flavors, locally sourced', image: "https://i.pinimg.com/1200x/ca/8e/e7/ca8ee794d73a7438843ec224aafe4414.jpg" },
    { title: 'Herbal Essentials', desc: 'Pure, potent herbs for wellness', image: "https://i.pinimg.com/1200x/e5/27/15/e527156003e6f61810ce8a19b3ea96e8.jpg" },
    { title: 'Powdered Spices', desc: 'Fine-ground for effortless cooking', image: "https://i.pinimg.com/1200x/e2/e1/de/e2e1def0a8caf9034d7de992067f1efe.jpg" },
    { title: 'Seed Varieties', desc: 'Whole seeds bursting with aroma', image: "https://i.pinimg.com/1200x/10/ca/56/10ca5609fbf45b00400d74fc2dbeb2c1.jpg" },
    { title: 'Leaf Infusions', desc: 'Dried leaves for teas and more', image: "https://i.pinimg.com/1200x/36/5b/3d/365b3d604700046658dcd3341e9a7108.jpg" }
  ];

  const featuredMixes = [
    {
      name: 'Vitality Blend',
      desc: 'Roots & spices for daily energy',
      image: "https://i.pinimg.com/1200x/29/c1/23/29c123b447350a2df01f88b138a987d6.jpg",
      price: 'GH₵49',
      rating: 4.9
    },
    {
      name: 'Turmeric Elixir',
      desc: 'Golden glow with anti-inflammatory boost',
      image: "https://i.pinimg.com/1200x/cb/af/b1/cbafb19663f02a76e2dedd0a2d383805.jpg",
      price: 'GH₵42',
      rating: 4.8
    },
    {
      name: 'Cinnamon Dream',
      desc: 'Warm notes for sweet indulgences',
      image: "https://i.pinimg.com/1200x/05/1e/97/051e97d25d621254c90893e9752bb8ee.jpg",
      price: 'GH₵36',
      rating: 5.0
    }
  ];

  const organicPicks = [
    {
      name: 'Fresh Ginger',
      desc: 'Hand-harvested, vibrant potency',
      image: "https://i.pinimg.com/1200x/25/85/db/2585db203b377e7a6aa9549252bfb968.jpg",
      price: 'GH₵28',
      rating: 4.7
    },
    {
      name: 'Clove Pods',
      desc: 'Intense aroma for bold dishes',
      image: "https://i.pinimg.com/1200x/e7/18/5d/e7185d2fbdd5bdfbcd462eba190e1eaf.jpg",
      price: 'GH₵45',
      rating: 4.9
    },
    {
      name: 'Peppercorn Elite',
      desc: 'Ethically farmed, sharp edge',
      image: "https://i.pinimg.com/1200x/5d/f9/64/5df964f13335351e47ac01d4d82c18be.jpg",
      price: 'GH₵39',
      rating: 4.8
    }
  ];

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <GrStar 
          key={i} 
          className={`text-sm ${i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating})</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50/50 to-white flex flex-col items-center py-20 px-4 relative overflow-hidden">
      {/* Subtle background pattern for modernity */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(220,20,60,0.02)_25%,rgba(220,20,60,0.02)_50%,transparent_50%,transparent_75%,rgba(220,20,60,0.02)_75%,rgba(220,20,60,0.02))] bg-size-[20px_20px] animate-pulse"></div>
      </div>

      {/* Hero Section with Modern Typography */}
      <motion.section
        className="text-center max-w-4xl mx-auto mb-16 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h1 
          className="font-montserrat-black text-5xl md:text-7xl bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 leading-tight"
          variants={fadeInUpVariants}
        >
          Curated Categories
        </motion.h1>
        <motion.p 
          className="font-montserrat-medium text-xl text-gray-600 max-w-2xl mx-auto"
          variants={slideInRightVariants}
        >
          Discover sustainable spices and organic treasures designed for the discerning palate.
        </motion.p>
      </motion.section>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Categories Grid - Modern Grid Layout */}
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl w-full mb-20 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {categories.map((cat, index) => (
          <ModernCard key={index} variants={itemVariants} className="text-center p-6">
            <motion.img
              src={cat.image}
              alt={cat.title}
              className="w-16 h-16 mx-auto mb-4 rounded-xl shadow-md object-cover border border-gray-100"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <h3 className="font-montserrat-semi-bold text-gray-800 text-base mb-1">{cat.title}</h3>
            <p className="font-montserrat-regular text-gray-500 text-sm">{cat.desc}</p>
          </ModernCard>
        ))}
      </motion.section>
      
      {/* Featured Mixes - Clean Cards */}
      <motion.section 
        className="mb-20 max-w-6xl w-full z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 
          className="font-montserrat-bold text-3xl md:text-4xl text-gray-900 text-center mb-8"
          variants={fadeInUpVariants}
        >
          Signature Mixes
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMixes.map((mix, index) => (
            <ModernCard key={index} variants={cardVariants} className="p-6 text-center">
              <motion.img
                src={mix.image}
                alt={mix.name}
                className="w-24 h-24 mx-auto mb-4 rounded-lg shadow-md object-cover"
                transition={{ duration: 0.3 }}
              />
              <h3 className="font-montserrat-semi-bold text-gray-800 text-lg mb-2">{mix.name}</h3>
              <p className="font-montserrat-regular text-gray-600 text-sm mb-4">{mix.desc}</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-montserrat-bold text-xl text-gray-900">{mix.price}</span>
                  {renderStars(mix.rating)}
                </div>
                <AddToCartButton
                  isAuthenticated={isAuthenticated}
                  onLoginRequired={handleLoginRequired}
                  productName={mix.name}
                  productImage={mix.image}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-montserrat-medium"
                />
              </div>
            </ModernCard>
          ))}
        </div>
      </motion.section>

      {/* Organic Picks Section */}
      <motion.section 
        className="mb-20 max-w-6xl w-full z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 
          className="font-montserrat-bold text-3xl md:text-4xl text-gray-900 text-center mb-8"
          variants={fadeInUpVariants}
        >
          Organic Highlights
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {organicPicks.map((pick, index) => (
            <ModernCard key={index} variants={cardVariants} className="overflow-hidden">
              <motion.img
                src={pick.image}
                alt={pick.name}
                className="w-full h-48 object-cover"
                transition={{ duration: 0.3 }}
              />
              <div className="p-6">
                <h3 className="font-montserrat-semi-bold text-gray-800 text-lg mb-2">{pick.name}</h3>
                <p className="font-montserrat-regular text-gray-600 text-sm mb-4">{pick.desc}</p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-montserrat-bold text-xl text-gray-900">{pick.price}</span>
                    {renderStars(pick.rating)}
                  </div>
                  <AddToCartButton
                    isAuthenticated={isAuthenticated}
                    onLoginRequired={handleLoginRequired}
                    productName={pick.name}
                    productImage={pick.image}
                    className="px-4 py-2 rounded-lg font-montserrat-medium"
                  />
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      </motion.section>

      {/* Modern CTA Section */}
      <motion.section 
        className="text-center py-12 px-8 bg-white/60 rounded-2xl max-w-4xl mx-auto shadow-lg z-10"
        variants={fadeInUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h3 className="font-montserrat-bold text-2xl md:text-3xl text-gray-900 mb-4">
          Elevate Your Culinary Journey
        </h3>
        <p className="font-montserrat-regular text-gray-600 text-lg mb-6 max-w-lg mx-auto">
          Fresh updates weekly. Join our community for exclusive drops and tips.
        </p>
        <motion.button 
          className="bg-linear-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-xl font-montserrat-semi-bold text-lg hover:from-gray-800 hover:to-gray-700 transition-all"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Browse All Products
        </motion.button>
      </motion.section>
    </div>
  );
}
