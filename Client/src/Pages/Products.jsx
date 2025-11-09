// Products.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import AddToCartButton from '../Components/AddToCartButton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const categories = [
  'All', 'Cooking Essentials', 'Medicinal Herbs', 'Baking & Desserts', 'Exotic Blends', 'Ayurvedic Wellness', 'Tea & Infusions'
];

const products = [
  // Cooking Essentials
  { id: 1, name: "Organic Black Peppercorns", category: "Cooking Essentials", price: 12.99, image: "https://i.pinimg.com/1200x/9e/44/87/9e44879f2e475f3fd86f5a1fe3981cfe.jpg", desc: "Whole Tellicherry peppercorns for grinding fresh—bold, aromatic heat.", rating: 4.9, certified: true, origin: "India" },
  { id: 2, name: "Madras Curry Powder", category: "Cooking Essentials", price: 8.99, image: "https://i.pinimg.com/1200x/b7/bd/62/b7bd625ce2d0655d0cd796956df23665.jpg", desc: "Authentic blend of coriander, turmeric, and chili for vibrant curries.", rating: 4.8, certified: true, origin: "Sri Lanka" },
  { id: 3, name: "Himalayan Pink Salt", category: "Cooking Essentials", price: 6.50, image: "https://i.pinimg.com/1200x/a2/0b/48/a20b489709f785f6d709e5ff39edc742.jpg", desc: "Pure, mineral-rich crystals harvested from ancient sea beds.", rating: 4.7, certified: false, origin: "Pakistan" },

  // Medicinal Herbs
  { id: 4, name: "Organic Turmeric Root Powder", category: "Medicinal Herbs", price: 9.99, image: "https://i.pinimg.com/1200x/e8/7d/f7/e87df702fbb3a05f9ca3d4fce53252ce.jpg", desc: "High-curcumin golden root for anti-inflammatory teas and tonics.", rating: 5.0, certified: true, origin: "India" },
  { id: 5, name: "Dried Ginger Slices", category: "Medicinal Herbs", price: 7.99, image: "https://i.pinimg.com/1200x/d2/04/83/d204830627df52cc3c6d4bd792dbd5e7.jpg", desc: "Sun-dried for digestive wellness and immune support infusions.", rating: 4.9, certified: true, origin: "China" },
  { id: 6, name: "Ashwagandha Powder", category: "Medicinal Herbs", price: 15.99, image: "https://i.pinimg.com/1200x/32/d4/9a/32d49a5e0ade8fb71ffeaf358641bd27.jpg", desc: "Adaptogenic root for stress reduction and vitality enhancement.", rating: 4.8, certified: true, origin: "India" },

  // Baking & Desserts
  { id: 7, name: "Ceylon Cinnamon Sticks", category: "Baking & Desserts", price: 8.50, image: "https://i.pinimg.com/1200x/3f/7f/af/3f7fafed9688768f48b1ec1eb3d0b700.jpg", desc: "True cinnamon with delicate sweetness for pastries and lattes.", rating: 4.9, certified: true, origin: "Sri Lanka" },
  { id: 8, name: "Vanilla Bean Pods", category: "Baking & Desserts", price: 19.99, image: "https://i.pinimg.com/1200x/ed/cb/50/edcb5045599fee7e35130ad0fba139e7.jpg", desc: "Premium Madagascar beans for rich, authentic flavor in desserts.", rating: 5.0, certified: false, origin: "Madagascar" },
  { id: 9, name: "Nutmeg Whole", category: "Baking & Desserts", price: 10.99, image: "https://i.pinimg.com/1200x/0b/de/6c/0bde6cc14a90a84a62e05a04336e91d0.jpg", desc: "Freshly grated for warm, nutty notes in pies and custards.", rating: 4.7, certified: true, origin: "Indonesia" },

  // Exotic Blends
  { id: 10, name: "Ras el Hanout", category: "Exotic Blends", price: 11.99, image: "https://i.pinimg.com/1200x/a5/c3/73/a5c373ce248c803b87944d9a7617d626.jpg", desc: "Moroccan master blend of 12 spices for tagines and roasts.", rating: 4.8, certified: true, origin: "Morocco" },
  { id: 11, name: "Za'atar Seasoning", category: "Exotic Blends", price: 9.50, image: "https://i.pinimg.com/1200x/fb/20/05/fb2005c3512a9e82fafe14672258a3b8.jpg", desc: "Lebanese herb mix with sesame and sumac for flatbreads.", rating: 4.9, certified: true, origin: "Lebanon" },
  { id: 12, name: "Garam Masala", category: "Exotic Blends", price: 10.50, image: "https://i.pinimg.com/1200x/4f/9c/2c/4f9c2c9ca1e83df63fc2ddf0e8a79aa8.jpg", desc: "Indian warming blend for curries and marinades.", rating: 4.8, certified: true, origin: "India" },

  // Ayurvedic Wellness
  { id: 13, name: "Triphala Powder", category: "Ayurvedic Wellness", price: 13.99, image: "https://i.pinimg.com/1200x/fe/28/dd/fe28dd7d6bdb64cc003d2d3472053460.jpg", desc: "Ayurvedic detox blend of three fruits for gentle cleansing.", rating: 4.7, certified: true, origin: "India" },
  { id: 14, name: "Tulsi Holy Basil", category: "Ayurvedic Wellness", price: 8.99, image: "https://i.pinimg.com/1200x/b8/8f/34/b88f340b2b26feb0f2d691e1edbc1325.jpg", desc: "Sacred leaf for stress relief and respiratory health.", rating: 4.9, certified: true, origin: "India" },
  { id: 15, name: "Shatavari Root", category: "Ayurvedic Wellness", price: 14.99, image: "https://i.pinimg.com/1200x/60/dd/02/60dd02330cffef606b3d350ff4de8406.jpg", desc: "Hormonal balance herb for women's wellness rituals.", rating: 4.8, certified: true, origin: "India" },

  // Tea & Infusions
  { id: 16, name: "Chamomile Flowers", category: "Tea & Infusions", price: 7.50, image: "https://i.pinimg.com/1200x/d1/4a/ad/d14aad7a811f2e7e20a9fb2cb752859d.jpg", desc: "Egyptian blooms for calming bedtime infusions.", rating: 4.9, certified: true, origin: "Egypt" },
  { id: 17, name: "Peppermint Leaves", category: "Tea & Infusions", price: 6.99, image: "https://i.pinimg.com/1200x/65/e6/11/65e6115225cd88f6c2634fd2c01ab2ba.jpg", desc: "Organic leaves for digestive soothing and refreshment.", rating: 4.8, certified: true, origin: "USA" },
  { id: 18, name: "Rooibos Loose Leaf", category: "Tea & Infusions", price: 9.99, image: "https://i.pinimg.com/1200x/34/6f/cd/346fcdfb1287a956d67425d7666b8f0e.jpg", desc: "South African red bush for antioxidant-rich caffeine-free brews.", rating: 4.7, certified: true, origin: "South Africa" }
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated] = useState(false); // Mock authentication state

  // Mock login handler
  const handleLoginRequired = () => {
    // Redirect to client auth page for signup or login
    window.location.href = '/clientauth';
  };

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="relative h-96 flex items-center justify-center bg-linear-to-br from-secondary/10 via-accent/10 to-amber/20"
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center opacity-20" />
        <motion.div 
          className="text-center z-10 px-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair-display-extra-bold text-4xl md:text-6xl  mb-4 drop-shadow-lg">
            Curated Spice Collection
          </h1>
          <p className="font-montserrat-light text-xl  max-w-2xl mx-auto drop-shadow-md">
            Ethically sourced, premium organic spices that transform ordinary moments into extraordinary experiences.
          </p>
        </motion.div>
      </motion.section>

      {/* Filters & Search */}
      <motion.section 
        className="py-12 px-4 md:px-8 lg:px-16 bg-charcoal"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div 
            className="flex flex-wrap justify-center gap-2"
            variants={itemVariants}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full font-montserrat-semi-bold text-sm transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-br from-secondary/10 via-accent/10 to-amber/20 text-text-light shadow-lg hover:shadow-[0_0_10px_rgba(220,20,60,0.3)]'
                    : 'bg-gradient-to-br from-secondary/10 via-accent/10 to-amber/20 text-text-light hover:bg-info/20 hover:border-info/30 border border-text-light/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            <input
              type="text"
              placeholder="Search spices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-full border border-border bg-text-light/10 text-text-light focus:outline-none focus:border-info focus:ring-2 focus:ring-info/20 transition-all duration-300 w-64 placeholder:text-text-light/60"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
        </div>
      </motion.section>

      {/* Products Grid */}
      <motion.section 
        className="py-20 px-4 md:px-8 lg:px-16 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <motion.p 
              className="text-center font-montserrat-medium text-xl text-charcoal py-12"
              variants={itemVariants}
            >
              No spices found matching your search. Try broadening your criteria.
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <motion.article 
                  key={product.id}
                  className="group bg-card rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-700 border border-border hover:border-secondary/50 relative"
                  variants={itemVariants}
                  whileHover={{ y: -15, rotateX: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Premium Badge */}
                  {product.certified && (
                    <motion.div 
                      className="absolute top-4 left-4 z-10 bg-success text-text-dark px-2 py-1 rounded-full text-xs font-montserrat-bold uppercase tracking-wide shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      Certified Organic
                    </motion.div>
                  )}

                  {/* Image with Gradient Overlay */}
                  <div className="relative overflow-hidden bg-linear-to-t from-background-dark/50 to-transparent">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div 
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                    >
                      <button className="bg-text-light/10 backdrop-blur-sm p-2 rounded-full hover:bg-info/20 shadow-md">
                        <Heart className="w-5 h-5 text-secondary" />
                      </button>
                      <button className="bg-secondary/90 text-text-light p-2 rounded-full hover:bg-error shadow-md">
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-montserrat-light text-xs text-charcoal">{product.origin}</span>
                      <div className="flex text-success">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                        ))}
                        <span className="ml-1 text-xs font-montserrat-medium">({product.rating})</span>
                      </div>
                    </div>
                    <h3 className="font-playfair-display-semi-bold text-xl text-text-dark mb-2 leading-tight group-hover:text-secondary transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="font-montserrat-light text-charcoal mb-4 h-12 overflow-hidden line-clamp-2">
                      {product.desc}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="font-playfair-display-bold text-2xl text-secondary tracking-tight">
                        ${product.price}
                      </span>
                    <AddToCartButton
                      isAuthenticated={isAuthenticated}
                      onLoginRequired={handleLoginRequired}
                      productName={product.name}
                      productImage={product.image}
                    />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-3xl bg-gradient-to-r from-info/10 to-success/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}