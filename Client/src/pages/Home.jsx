// Home.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FiArrowRight, FiAward, FiShield, FiTruck, FiHeart, FiSun, FiUsers, FiStar } from "react-icons/fi";
import Skeleton from "../components/Skeleton";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=2400",
    title: "Pure Turmeric",
    desc: "Golden roots kissed by Himalayan sun. Pure power in every pinch.",
    accent: "Organic • Single Origin • Lab Tested"
  },
  {
    img: "https://i.pinimg.com/1200x/98/b0/70/98b0701f9e240b7cdc900eab4c133a9f.jpg",
    title: "Smoked Paprika",
    desc: "Deep Spanish soul. Smoky fire that awakens every dish.",
    accent: "Artisan • Small Batch • Oak Smoked"
  },
  {
    img: "https://i.pinimg.com/1200x/6e/72/81/6e7281da3c81cc44475dd03971e6c5b2.jpg",
    title: "Madagascar Vanilla",
    desc: "Velvety beans cured with centuries-old patience.",
    accent: "Premium • Traceable • Grade A"
  }
];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (loading) return <Skeleton />;

  return (
    <div className="bg-[#FDF8F1] overflow-hidden">
      {/* NAV - Assume it's handled elsewhere or keep fixed */}

      {/* HERO - Enhanced Carousel */}
      <section className="relative h-screen">
        <div className="relative h-full w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={slides[activeSlide].img}
                className="w-full h-full object-cover"
                alt={slides[activeSlide].title}
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-[#2D1606]/95" />
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i === activeSlide ? "bg-white w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-8 py-3 rounded-3xl text-white text-sm mb-8 border border-white/20"
              >
                <FiSun className="text-emerald-400" /> 100% Natural • Direct from Farm
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.h1
                  key={activeSlide}
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -80 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                  className="text-6xl md:text-[6.5rem] font-serif font-bold text-white leading-[1.05] tracking-tighter mb-6 drop-shadow-2xl"
                >
                  {slides[activeSlide].title}
                </motion.h1>
              </AnimatePresence>

              <motion.p
                key={activeSlide + "desc"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl md:text-3xl text-orange-100 max-w-2xl mx-auto mb-10 font-light"
              >
                {slides[activeSlide].desc}
              </motion.p>

              <motion.p className="text-sm uppercase tracking-[3px] text-orange-200 mb-8">
                {slides[activeSlide].accent}
              </motion.p>

              <motion.a
                href="/products"
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-4 px-14 py-7 bg-white hover:bg-amber-50 text-[#2D1606] rounded-3xl font-semibold text-xl shadow-2xl transition-all duration-300"
              >
                Explore the Harvest
                <FiArrowRight className="group-hover:translate-x-2 transition" />
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR - More Premium */}
      <div className="border-b border-stone-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-16 gap-y-8 text-sm font-medium opacity-90">
          <div className="flex items-center gap-3"><FiShield className="text-emerald-600" /> Pure & Traceable</div>
          <div className="flex items-center gap-3"><FiSun className="text-amber-600" /> Certified Organic</div>
          <div className="flex items-center gap-3"><FiTruck className="text-orange-600" /> Climate Positive</div>
          <div className="flex items-center gap-3"><FiStar className="text-yellow-600" /> 4.98/5 from 2,847 homes</div>
        </div>
      </div>

      {/* STORY SECTION */}
      <section id="story" className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="uppercase text-orange-600 tracking-[4px] text-sm font-semibold mb-4">EST. 2026 • ACCRA, GHANA</div>
            <h2 className="text-6xl md:text-7xl font-serif leading-none tracking-tighter text-[#2D1606]">
              Spices as nature<br />intended.
            </h2>
            <p className="mt-8 text-xl text-stone-600 leading-relaxed">
              We partner directly with small family farms across India, Sri Lanka, Madagascar, and Ghana. 
              No middlemen. No shortcuts. Just pure, honest, soulful spices.
            </p>
            <div className="mt-10 flex gap-4">
              <div className="px-6 py-3 bg-orange-100 text-orange-700 rounded-2xl text-sm font-medium">Fair Trade</div>
              <div className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-2xl text-sm font-medium">Carbon Negative</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] overflow-hidden shadow-2xl border border-stone-200"
          >
            <img
              src="https://i.pinimg.com/1200x/f1/be/e8/f1bee871d339f90c2a4aade13e807a82.jpg"
              className="w-full h-full object-cover"
              alt="Farm to Table"
            />
          </motion.div>
        </div>
      </section>

      {/* WHY MELOS - Enhanced */}
      <section id="why" className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-bold text-[#2D1606]">Why Ghanaian Homes Love Melos</h2>
            <p className="mt-4 text-stone-600 max-w-md mx-auto">Real flavor. Real health. Real impact.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: FiAward, title: "Award-Winning Quality", desc: "Recognized globally for unmatched purity and explosive flavor." },
              { icon: FiShield, title: "100% Chemical Free", desc: "Grown and processed without pesticides, fillers, or additives." },
              { icon: FiUsers, title: "Farmer Direct", desc: "We pay farmers 4× market rate. Your purchase changes lives." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -12 }}
                className="bg-[#FDF8F1] p-12 rounded-3xl hover:shadow-xl transition-all group"
              >
                <item.icon size={52} className="text-orange-600 mb-8 group-hover:scale-110 transition" />
                <h3 className="text-3xl font-serif font-bold mb-4">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PROCESS */}
      <section id="process" className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif font-bold text-[#2D1606]">From Farm to Your Jar</h2>
          <p className="text-stone-500 mt-4 text-lg">A journey of patience, respect, and tradition</p>
        </div>

        <div className="space-y-32">
          {[1,2,3].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <img
                  src={`https://picsum.photos/id/${40 + i}/1200/800`}
                  className="rounded-3xl shadow-2xl w-full"
                  alt={`Step ${step}`}
                />
              </div>
              <div>
                <div className="text-orange-600 text-7xl font-serif font-bold mb-6">0{step}</div>
                <h3 className="text-4xl font-serif font-bold mb-6">
                  {["Hand Harvest", "Traditional Curing", "Small-Batch Packing"][step-1]}
                </h3>
                <p className="text-lg text-stone-600 leading-relaxed">
                  {step === 1 && "Carefully handpicked at peak ripeness by experienced farmers who know each plant personally."}
                  {step === 2 && "Sun-dried or traditionally smoked using time-honored methods that lock in maximum flavor and healing compounds."}
                  {step === 3 && "Gently stone-ground and packed by hand in small batches to preserve every precious aroma and essential oil."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#2D1606] text-white py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-serif mb-16">Real Homes. Real Love.</h2>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="italic text-3xl leading-relaxed max-w-3xl mx-auto"
          >
            “My jollof has never tasted this alive. The aroma hits you before you even open the jar. Melos is now a staple in my kitchen.”
          </motion.div>
          <p className="mt-10 text-orange-200">- Akosua Mensah, Accra • Home Chef & Mother of 3</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-linear-to-b from-white to-[#FDF8F1]">
        <div className="max-w-3xl mx-auto text-center px-6">
          <FiSun size={90} className="text-orange-500 mx-auto mb-8" />
          <h2 className="text-6xl font-serif leading-none mb-8">Ready to elevate your cooking?</h2>
          <p className="text-xl text-stone-600 mb-12">Join thousands of Ghanaian families cooking with intention and purity.</p>
          <motion.a
            href="/products"
            whileHover={{ scale: 1.05 }}
            className="inline-block px-20 py-8 bg-[#2D1606] hover:bg-black text-white rounded-3xl text-2xl font-semibold shadow-xl"
          >
            Shop Melos Collection
          </motion.a>
        </div>
      </section>
    </div>
  );
};

export default Home;