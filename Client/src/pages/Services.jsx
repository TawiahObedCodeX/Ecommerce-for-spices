import React from "react";
import { motion } from "framer-motion";
import { FiTarget, FiCoffee, FiTruck, FiCheckCircle, FiShield, FiHeart, FiWind, FiSun } from "react-icons/fi";
import { Link } from "react-router-dom";

const Services = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const processSteps = [
    { 
      title: "Wild Sourcing", 
      desc: "We don't buy from industrial auctions. Our team travels to the volcanic soils of Indonesia and the high altitudes of the Himalayas to find spices growing in their natural, wild habitat.",
      icon: <FiWind className="text-emerald-500" /> 
    },
    { 
      title: "Traditional Drying", 
      desc: "Industrial heat-drying kills the essential oils. Melo's spices are sun-dried or shade-cured using ancient techniques that preserve the medicinal 'curcumin' and 'piperine' levels.",
      icon: <FiSun className="text-orange-500" /> 
    },
    { 
      title: "Small-Batch Milling", 
      desc: "We mill only what we need. Our stone-grinding process ensures that the friction doesn't burn the delicate aromas, keeping the spice 'alive' until it reaches your kitchen.",
      icon: <FiTarget className="text-red-500" /> 
    }
  ];

  return (
    <div className="bg-[#FDF8F1] min-h-screen ">
      {/* --- SECTION 1: HERO STORY --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.3]" 
            alt="Spice Market"
          />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            className="text-orange-500 font-black uppercase text-xs md:text-sm mb-6 block"
          >
            Est. 2026 • Accra, Ghana
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-6xl md:text-[10rem] font-serif font-black text-white leading-none tracking-tighter"
          >
            Nature's <br />
            <span className="text-orange-600 italic">Alchemy.</span>
          </motion.h1>
        </div>

        {/* <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs font-black uppercase tracking-[0.3em]"
        >
          Scroll to Explore
        </motion.div> */}
      </section>

      {/* --- SECTION 2: THE PHILOSOPHY (BENTO GRID) --- */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-12 gap-8">
          <motion.div {...fadeInUp} className="lg:col-span-8 bg-[#2D1606] rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl group-hover:bg-orange-600/40 transition-all duration-700" />
            <h2 className="text-4xl md:text-6xl font-serif font-black mb-8 italic">The 100% Natural Promise</h2>
            <p className="text-stone-400 text-xl leading-relaxed max-w-2xl">
              At Melo's, we believe that nature is already perfect. Most commercial spices are laden with anti-caking agents, artificial dyes, and sawdust fillers. Our mission was born in the spice gardens of Ghana: **Pure, Raw, Uncut Botanicals.**
            </p>
            <div className="mt-12 flex flex-wrap gap-6">
              <div className="flex items-center space-x-2 text-orange-500 font-bold uppercase text-[10px] tracking-widest"><FiCheckCircle /> <span>No MSG</span></div>
              <div className="flex items-center space-x-2 text-orange-500 font-bold uppercase text-[10px] tracking-widest"><FiCheckCircle /> <span>No Additives</span></div>
              <div className="flex items-center space-x-2 text-orange-500 font-bold uppercase text-[10px] tracking-widest"><FiCheckCircle /> <span>Organic Only</span></div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-4 bg-orange-600 rounded-[4rem] p-12 text-white flex flex-col justify-end">
             <FiHeart size={48} className="mb-8" />
             <h3 className="text-3xl font-black mb-4 leading-tight">Spices as Medicine</h3>
             <p className="text-orange-100 font-medium">Ancient civilizations used spices to heal. We preserve the bioactive compounds that help your body thrive.</p>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 3: THE JOURNEY (HORIZONTAL SCROLL STYLE) --- */}
      <section className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-5xl md:text-7xl font-serif font-black text-[#2D1606] tracking-tighter">The Artisan <span className="text-orange-600 italic">Process.</span></h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {processSteps.map((step, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -20 }}
              className="p-10 bg-[#FDF8F1] rounded-[3.5rem] border border-stone-100 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-8">
                {step.icon}
              </div>
              <h3 className="text-2xl font-black text-[#2D1606] mb-4">{step.title}</h3>
              <p className="text-stone-500 leading-relaxed font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTION 4: THE VALUES (DEEP CONTENT) --- */}
      <section className="py-32 bg-[#2D1606] text-white overflow-hidden relative">
        <div className="absolute left-0 top-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full animate-pulse" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-5xl md:text-8xl font-serif font-black mb-12">The <span className="text-orange-600 italic">Melo's</span> Standard.</h2>
            <div className="grid md:grid-cols-2 gap-16 text-left">
              <div className="space-y-6">
                <h4 className="text-orange-500 font-black tracking-widest text-xs uppercase">Transparency</h4>
                <p className="text-stone-400 leading-relaxed text-lg">We can tell you exactly which village your Turmeric came from. By cutting out middle-men, we ensure that the farmers receive 4x the market rate, supporting education and clean water in growing regions.</p>
              </div>
              <div className="space-y-6">
                <h4 className="text-orange-500 font-black tracking-widest text-xs uppercase">Longevity</h4>
                <p className="text-stone-400 leading-relaxed text-lg">Our spices are packaged in UV-protected glass jars. Sunlight is the enemy of flavor. By using specialized materials, our spices stay fresh for up to 24 months, compared to the 6 months of plastic-packed alternatives.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 5: CALL TO ACTION --- */}
      <section className="py-40 text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-[#2D1606] mb-12">Ready to taste the <span className="text-orange-600 italic">real</span> thing?</h2>
          <Link 
            to="/products" 
            className="inline-flex items-center space-x-4 px-12 py-6 bg-[#2D1606] text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-orange-600 transition-all shadow-2xl shadow-orange-900/20"
          >
            <span>Explore the Vault</span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Services;