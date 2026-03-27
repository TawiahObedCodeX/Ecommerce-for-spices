import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiZap, FiAward, FiShield } from "react-icons/fi";
import Skeleton from "../components/Skeleton";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=2000",
    title: "Vibrant Turmeric",
    desc: "Ethically sourced from the sun-drenched hills of India."
  },
  {
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2000",
    title: "Smoked Paprika",
    desc: "Double-smoked over oak wood for 48 hours for deep flavor."
  }
];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  if (loading) return <Skeleton />;

  return (
    <div className="bg-[#FDF8F1] min-h-screen pb-20">
      {/* 1. HERO CAROUSEL SECTION */}
      <section className="relative h-screen px-4 md:px-6 pt-24 md:pt-32">
        <div className="relative h-full w-full rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img src={slides[activeSlide].img} className="w-full h-full object-cover" alt="Spice" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1606]/90 via-transparent to-transparent" />
              
              <div className="absolute bottom-12 left-8 md:bottom-24 md:left-20 max-w-2xl">
                <motion.h1 
                  initial={{ y: 50, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }}
                  className="text-5xl md:text-8xl font-serif font-black text-white leading-tight"
                >
                  {slides[activeSlide].title}
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-orange-200 text-lg md:text-2xl font-light mt-4 mb-8"
                >
                  {slides[activeSlide].desc}
                </motion.p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="px-10 py-5 bg-orange-600 text-white rounded-full font-bold flex items-center space-x-3 shadow-xl hover:bg-orange-500 transition-all"
                >
                  <span>SHOP THE HARVEST</span>
                  <FiArrowRight />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          <div className="absolute right-12 bottom-12 flex space-x-3">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${activeSlide === i ? "w-12 bg-orange-500" : "w-4 bg-white/30"}`} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. BENTO FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-[#2D1606] rounded-[3rem] p-12 text-white flex flex-col justify-between">
            <FiAward size={40} className="text-orange-400 mb-8" />
            <div>
              <h2 className="text-4xl font-serif font-bold mb-4">Award Winning Blends</h2>
              <p className="text-orange-100/60 leading-relaxed">Voted #1 Artisan spice provider of 2026. Hand-packed in small batches for peak potency.</p>
            </div>
          </div>
          <div className="bg-orange-500 rounded-[3rem] p-8 text-white flex flex-col items-center justify-center text-center">
            <FiZap size={40} className="mb-4" />
            <h3 className="text-2xl font-bold">Fast Delivery</h3>
          </div>
          <div className="bg-white rounded-[3rem] border border-stone-100 p-8 flex flex-col items-center justify-center text-center">
            <FiShield size={40} className="text-[#2D1606] mb-4" />
            <h3 className="text-2xl font-bold text-[#2D1606]">100% Pure</h3>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif font-black text-[#2D1606]">Curated Selections</h2>
          <p className="text-stone-500 mt-4 tracking-widest uppercase font-bold text-xs">Explore the world of flavor</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item}
              whileHover={{ y: -15 }}
              className="group relative bg-white rounded-[3rem] p-6 shadow-xl shadow-orange-900/5 overflow-hidden"
            >
              <div className="h-80 w-full overflow-hidden rounded-[2.5rem] mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1599940824399-b87987cb9724?q=80&w=800" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt="Product"
                />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#2D1606]">Madagascar Vanilla</h3>
                  <p className="text-orange-600 font-bold">$32.00</p>
                </div>
                <div className="bg-stone-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-stone-500">NEW</div>
              </div>
              <button className="w-full py-4 bg-[#FDF8F1] border border-stone-100 text-[#2D1606] rounded-2xl font-black group-hover:bg-[#2D1606] group-hover:text-white transition-all">
                ADD TO CART
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;