import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiShoppingBag, 
  FiStar, 
  FiLayers, 
  FiPhone, 
  FiSun, 
  FiAward, 
  FiTruck 
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const ProductSkeleton = () => (
  <div className="min-h-screen bg-[#FDF8F1] pt-24 animate-pulse">
    <div className="w-full h-[85vh] bg-stone-200" />
    <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[500px] bg-stone-200 rounded-[4rem]" />
      ))}
    </div>
  </div>
);

// Hero Carousel Slides
const heroSlides = [
  {
    img: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=2400",
    title: "Pure Turmeric",
    subtitle: "Golden & Powerful"
  },
  {
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2400",
    title: "Smoked Paprika",
    subtitle: "Deep & Smoky Flavor"
  },
  {
    img: "https://i.pinimg.com/1200x/8c/e7/0d/8ce70d367260bf668dafa8dba7c3b007.jpg",
    title: "Madagascar Vanilla",
    subtitle: "Rich & Aromatic"
  },
  {
    img: "https://i.pinimg.com/1200x/42/ed/82/42ed82790a1c3ea3ac819d5242cbcd4d.jpg",
    title: "Ceylon Cinnamon",
    subtitle: "Sweet & Warm"
  }
];

// Categories
const categories = [
  "All Spices", "Turmeric", "Paprika", "Cinnamon", "Vanilla", 
  "Cardamom", "Saffron", "Ginger", "Cloves", "Organic Blends"
];

// Products Data
const products = [
  { id: 1, name: "Pure Turmeric Powder", price: 45, oldPrice: 55, image: "/images/product1.jpeg", rating: "4.9", desc: "Premium single-origin turmeric from India.", category: "Turmeric" },
  { id: 2, name: "Smoked Paprika", price: 65, oldPrice: 75, image: "/images/product1.jpeg", rating: "4.8", desc: "Oak-smoked Spanish paprika with deep flavor.", category: "Paprika" },
  { id: 3, name: "Ceylon Cinnamon Sticks", price: 85, oldPrice: 95, image: "/images/product1.jpeg", rating: "5.0", desc: "True Ceylon cinnamon - sweet and delicate.", category: "Cinnamon" },
  { id: 4, name: "Madagascar Vanilla Beans", price: 120, oldPrice: 140, image: "/images/product1.jpeg", rating: "4.9", desc: "Grade A vanilla beans from Madagascar.", category: "Vanilla" },
  { id: 5, name: "Green Cardamom Pods", price: 70, oldPrice: 80, image: "/images/product1.jpeg", rating: "4.7", desc: "Fresh aromatic cardamom from Kerala.", category: "Cardamom" },
  { id: 6, name: "Saffron Threads", price: 320, oldPrice: 380, image: "/images/product1.jpeg", rating: "5.0", desc: "Premium Iranian saffron - highest quality.", category: "Saffron" },
];

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Spices");
  const [activeSlide, setActiveSlide] = useState(0);
  const { addToCart } = useCart();

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "All Spices" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (loading) return <ProductSkeleton />;

  return (
    <div className="bg-[#FDF8F1] min-h-screen overflow-x-hidden">
      
      {/* HERO CAROUSEL */}
      <section className="relative h-screen pt-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img 
              src={heroSlides[activeSlide].img} 
              className="w-full h-full object-cover" 
              alt={heroSlides[activeSlide].title} 
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-[#2D1606]/90" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white text-sm mb-6">
              <FiSun className="text-emerald-400" /> 100% Natural • Chemical Free
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={activeSlide}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -60 }}
                className="text-6xl md:text-8xl font-serif font-bold text-white leading-none tracking-tighter mb-4"
              >
                {heroSlides[activeSlide].title}
              </motion.h1>
            </AnimatePresence>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl text-orange-100 mb-12">
              {heroSlides[activeSlide].subtitle}
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
              className="px-14 py-6 bg-white text-[#2D1606] rounded-3xl font-semibold text-lg flex items-center gap-3 mx-auto"
            >
              Shop This Collection <FiShoppingBag />
            </motion.button>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${activeSlide === i ? "w-12 bg-white" : "w-6 bg-white/40"}`}
            />
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#2D1606] text-white py-4 overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1200] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-12 whitespace-nowrap text-sm font-medium tracking-widest"
        >
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              ✦ 100% NATURAL • NO CHEMICALS • SMALL BATCH ✦ 
              ETHICALLY SOURCED • FARMER DIRECT ✦ 
              PURE FLAVOR • HANDCRAFTED WITH PASSION
            </div>
          ))}
        </motion.div>
      </div>

      {/* CATEGORIES - NOW FULLY ACTIVE */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-4 rounded-3xl font-medium transition-all text-sm flex items-center gap-2 border
                ${selectedCategory === cat 
                  ? "bg-[#2D1606] text-white border-[#2D1606] shadow-lg" 
                  : "bg-white text-[#2D1606] border-stone-200 hover:border-orange-200"}`}
            >
              {cat === "All Spices" && <FiLayers />}
              {cat === "Turmeric" && <FiSun />}
              {cat === "Organic Blends" && <FiAward />}
              {cat === "Vanilla" && <FiTruck />}
              {cat}
            </motion.button>
          ))}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section id="products-section" className="max-w-7xl mx-auto px-6 pb-32">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2D1606] tracking-tighter">
              Our Collection
            </h2>
            <p className="text-stone-500 mt-3">
              {selectedCategory === "All Spices" ? "All Products" : selectedCategory} • {filteredProducts.length} items
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="wait">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                whileHover={{ y: -15 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6 bg-white px-5 py-2 rounded-2xl text-xs font-bold tracking-widest shadow">
                    ORGANIC
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-8 right-8 w-16 h-16 bg-[#2D1606] text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-orange-600 transition-all opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0"
                  >
                    <FiShoppingBag size={26} />
                  </button>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1.5">
                      <FiStar className="text-orange-500 fill-orange-500" size={18} />
                      <span className="text-sm font-medium text-stone-500">{product.rating}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 px-4 py-1 rounded-full">
                      New Batch
                    </span>
                  </div>

                  <h4 className="text-2xl font-serif font-bold text-[#2D1606] leading-tight mb-3">
                    {product.name}
                  </h4>

                  <p className="text-stone-600 text-[15px] leading-relaxed mb-6 line-clamp-2">
                    {product.desc}
                  </p>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-serif font-bold text-[#2D1606]">
                        GHS {product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-stone-400 text-sm line-through ml-3">
                          GHS {product.oldPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <a href="tel:0539526814" className="w-11 h-11 bg-stone-100 hover:bg-stone-200 rounded-2xl flex items-center justify-center transition">
                        <FiPhone size={20} />
                      </a>
                      <a href="https://wa.me/233244597912?text=Hi%2C%20I'm%20interested%20in%20this%20product%20from%20MELO'S%20Artisan!" 
                         target="_blank" rel="noopener noreferrer"
                         className="w-11 h-11 bg-stone-100 hover:bg-stone-200 rounded-2xl flex items-center justify-center transition">
                        <FaWhatsapp size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Products;