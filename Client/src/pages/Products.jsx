import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag, FiStar, FiLayers, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const ProductSkeleton = () => (
  <div className="min-h-screen bg-[#FDF8F1] pt-24 animate-pulse">
    <div className="w-full h-[85vh] bg-stone-200" />
    <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-[500px] bg-stone-200 rounded-[4rem]" />
      ))}
    </div>
  </div>
);

const products = [
  {
    id: 1,
    name: "Handcrafted Leather Bag",
    price: 320,
    oldPrice: 380,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800",
    rating: "4.9",
    desc: "Premium artisan leather with hand-stitched details from Ghana.",
  },
  {
    id: 2,
    name: "Wooden Bead Necklace",
    price: 85,
    oldPrice: 105,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb9f3382?q=80&w=800",
    rating: "4.8",
    desc: "Natural wood beads with brass accents, handmade in Accra.",
  },
  {
    id: 3,
    name: "Ceramic Coffee Mug Set",
    price: 145,
    oldPrice: 170,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf0f4?q=80&w=800",
    rating: "5.0",
    desc: "Hand-thrown ceramic set, microwave & dishwasher safe.",
  },
  {
    id: 4,
    name: "Woven Straw Basket",
    price: 95,
    oldPrice: 120,
    image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=800",
    rating: "4.7",
    desc: "Traditional Ghanaian weaving technique with colorful accents.",
  },
  {
    id: 5,
    name: "Brass Earrings Pair",
    price: 65,
    oldPrice: 85,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800",
    rating: "4.9",
    desc: "Hand-forged brass with natural stones, lightweight & elegant.",
  },
  {
    id: 6,
    name: "Embroidered Throw Pillow",
    price: 110,
    oldPrice: 135,
    image: "https://images.unsplash.com/photo-1584100936595-c6c4a6f1f1c4?q=80&w=800",
    rating: "4.8",
    desc: "Vibrant African-inspired embroidery on soft cotton.",
  },
];

const featured = [
  { 
    id: 1, 
    title: "The Saffron Reserve", 
    price: "GHS 320",
    tag: "Kashmir • Ghana Edition",
    badge: "Limited Harvest",
    desc: "Hand-harvested premium saffron with deep floral notes and rich crimson threads.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=2000",
    accentColor: "#C2410C",
    bgWord: "SAFFRON"
  },
  { 
    id: 2, 
    title: "Royal Cinnamon Bark", 
    price: "GHS 145",
    tag: "Ceylon • Single Origin",
    badge: "Artisan Grade",
    desc: "Ultra-fine Ceylon cinnamon with warm citrus sweetness, perfect for premium recipes.",
    img: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=2000",
    accentColor: "#92400E",
    bgWord: "CINNAMON"
  },
  { 
    id: 3, 
    title: "Smoked Paprika Noir", 
    price: "GHS 95",
    tag: "Extremadura • Double Smoked",
    badge: "Signature Blend",
    desc: "Rich, smoky Spanish paprika with sweet depth and bold Mediterranean character.",
    img: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=2000",
    accentColor: "#B91C1C",
    bgWord: "PAPRIKA"
  }
];

/* ─── NEW CATCHY CAROUSEL ─── */
const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const DURATION = 5500; // slightly faster for better engagement

  const startTimer = () => {
    clearInterval(intervalRef.current);
    setProgress(0);
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= DURATION) {
        setIndex(i => (i + 1) % featured.length);
      }
    }, 30);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [index]);

  const item = featured[index];

  return (
    <section className="relative w-full h-[85vh] overflow-hidden bg-[#2D1606]">

      {/* Background Image Slide */}
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={item.img}
          initial={{ scale: 1.15, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.08, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2D1606]/90 via-[#2D1606]/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
          >
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-white text-xs font-black tracking-[0.25em] uppercase">{item.tag}</span>
          </motion.div>

          {/* Big Title */}
          <motion.h1
            key={item.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0, 1] }}
            className="text-[clamp(2.8rem,7vw,6.5rem)] font-black leading-none tracking-tighter text-white mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {item.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            key={item.desc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-orange-100/80 max-w-md mb-10 leading-relaxed"
          >
            {item.desc}
          </motion.p>

          {/* Price & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-6"
          >
            <div className="text-5xl font-black text-white tracking-tight">
              {item.price}
            </div>
            <button 
              onClick={() => alert("Added to cart!")} 
              className="group flex items-center gap-3 bg-orange-600 hover:bg-orange-500 px-10 py-5 rounded-full text-white font-black text-sm uppercase tracking-widest transition-all active:scale-95"
            >
              <FiShoppingBag size={20} />
              Shop Now
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation - Progress + Dots (No Arrows) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6 w-full px-6">
        <div className="flex gap-4">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${i === index ? 'bg-orange-500 w-12' : 'bg-white/40 w-8 hover:bg-white/60'}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs h-px bg-white/20 overflow-hidden">
          <motion.div
            className="h-full bg-orange-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      </div>

      {/* Subtle floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
          style={{
            top: `${15 + (i * 9)}%`,
            left: `${10 + (i * 11)}%`,
          }}
          animate={{ 
            y: [0, -25, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 4 + (i % 3), 
            repeat: Infinity, 
            delay: i * 0.4 
          }}
        />
      ))}
    </section>
  );
};

/* ─── MAIN PRODUCTS PAGE ─── */
const Products = () => {
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <ProductSkeleton />;

  return (
    <div className="bg-[#FDF8F1] min-h-screen pb-20 overflow-x-hidden">
      {/* New Catchy Carousel */}
      <HeroCarousel />

      {/* Signature Collection Grid */}
      <section className="max-w-[1400px] mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center space-x-3 text-orange-600 mb-4">
              <FiLayers size={20} />
              <span className="font-black tracking-widest text-xs uppercase">The Collection</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-serif font-black text-[#2D1606] tracking-tighter">
              Curated <span className="italic text-orange-600">Aromas.</span>
            </h3>
          </div>
          <p className="text-stone-500 font-medium max-w-xs md:text-right italic leading-relaxed">
            Every grain is inspected under natural light to ensure 100% purity and color vibrance.
          </p>
        </div>

        <div className="pt-24 pb-20 bg-[#FFF8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-black text-[#2D1606] text-center mb-4 tracking-tight">
              Our Artisan Collection
            </h1>
            <p className="text-center text-[#2D1606]/70 max-w-md mx-auto mb-16">
              Handmade with love in Ghana • Every piece tells a story
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -20 }}
                  className="group relative"
                >
                  <div className="h-[500px] rounded-[5rem] overflow-hidden shadow-2xl shadow-orange-900/5 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1606]/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Floating Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product)}
                      className="absolute bottom-10 right-10 w-20 h-20 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-2xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 hover:bg-orange-700 active:scale-95"
                    >
                      <FiShoppingBag size={28} />
                    </button>

                    {/* Phone & WhatsApp Icons */}
                    <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
                      <a
                        href="tel:0539526814"
                        className="w-11 h-11 bg-white/95 backdrop-blur shadow-lg hover:bg-white text-[#2D1606] rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                        title="Call us: 0539526814"
                      >
                        <FiPhone size={24} />
                      </a>
                      <a
                        href="https://wa.me/233244597912?text=Hi%2C%20I'm%20interested%20in%20this%20product%20from%20MELO'S%20Artisan!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 bg-white/95 backdrop-blur shadow-lg hover:bg-white text-[#2D1606] rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                        title="Chat on WhatsApp: 0244597912"
                      >
                        <FaWhatsapp size={24} />
                      </a>
                    </div>
                  </div>

                  <div className="mt-10 px-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <FiStar className="text-orange-500 fill-orange-500" size={16} />
                        <span className="text-xs font-black text-stone-400 tracking-widest">
                          {product.rating} RATING
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-orange-600 tracking-[0.2em] bg-orange-100 px-4 py-1 rounded-full">
                        New Batch
                      </span>
                    </div>

                    <h4 className="text-4xl font-serif font-black text-[#2D1606] mb-3 tracking-tight leading-none">
                      {product.name}
                    </h4>

                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-serif font-black text-[#2D1606]">
                        GHS {product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-stone-400 text-sm line-through font-bold">
                          GHS {product.oldPrice}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-[#2D1606]/70 text-[15px] leading-relaxed">
                      {product.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;