import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  FiArrowRight, 
  FiAward, 
  FiShield, 
  FiTruck, 
  FiHeart, 
  FiSun, 
  FiUsers 
} from "react-icons/fi";
import Skeleton from "../components/Skeleton";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=2400",
    title: "Pure Turmeric",
    desc: "Golden roots from the sun-drenched hills of India.",
    accent: "Organic • Single Origin"
  },
  {
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2400",
    title: "Smoked Paprika",
    desc: "Deep, soulful flavor born from tradition.",
    accent: "Artisan • Small Batch"
  },
  {
    img: "https://images.unsplash.com/photo-1606913089185-2f8c0e7f8c0f?q=80&w=2400",
    title: "Madagascar Vanilla",
    desc: "Pure essence of nature, cured with patience.",
    accent: "Premium • Traceable"
  }
];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => { 
      clearTimeout(timer); 
      clearInterval(interval); 
    };
  }, []);

  if (loading) return <Skeleton />;

  return (
    <div className="bg-[#FDF8F1] overflow-hidden">
      {/* NAV - Already fixed */}
      

      {/* HERO - Massive */}
      <section className="relative h-screen ">
        {/* ... Your existing Hero code (unchanged for quality) ... */}
        <div className="relative h-full w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img src={slides[activeSlide].img} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-[#2D1606]/90" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-3xl text-white text-sm mb-8">
                <FiSun className="text-emerald-400" /> 100% Natural • No Chemicals
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.h1
                  key={activeSlide}
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -80 }}
                  transition={{ duration: 1 }}
                  className="text-6xl md:text-8xl font-serif font-bold text-white leading-none tracking-tighter mb-6"
                >
                  {slides[activeSlide].title}
                </motion.h1>
              </AnimatePresence>

              <p className="text-2xl text-orange-100 max-w-2xl mx-auto mb-12">
                {slides[activeSlide].desc}
              </p>

              <motion.a
                href="/products"
                whileHover={{ scale: 1.06 }}
                className="inline-flex items-center gap-4 px-12 py-6 bg-white text-[#2D1606] rounded-3xl font-semibold text-lg shadow-2xl"
              >
                Explore the Harvest <FiArrowRight />
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="border-b border-stone-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-x-16 gap-y-8 text-sm font-medium opacity-80">
          <div className="flex items-center gap-3"><FiShield /> Pure & Traceable</div>
          <div className="flex items-center gap-3"><FiSun /> Certified Organic</div>
          <div className="flex items-center gap-3"><FiTruck /> Climate Positive</div>
          <div className="flex items-center gap-3"><FiHeart /> Loved by Thousands</div>
        </div>
      </div>

      {/* STORY SECTION */}
      <section id="story" className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="uppercase text-orange-600 tracking-widest text-sm font-semibold mb-4">OUR ROOTS</div>
            <h2 className="text-6xl md:text-7xl font-serif leading-none tracking-tighter text-[#2D1606]">
              Spices as nature<br />intended.
            </h2>
            <p className="mt-8 text-xl text-stone-600 leading-relaxed">
              We partner directly with small family farms across India, Sri Lanka, and Madagascar. 
              No middlemen. No chemicals. Just pure, honest spices.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=2400" className="w-full h-full object-cover" alt="Farm" />
          </motion.div>
        </div>
      </section>

      {/* WHY MELOS - Benefits */}
      <section id="why" className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-bold text-[#2D1606]">Why Families Choose Melos</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: FiAward, title: "Award-Winning Quality", desc: "Recognized globally for purity and flavor intensity." },
              { icon: FiShield, title: "100% Chemical Free", desc: "Grown and processed without pesticides or additives." },
              { icon: FiUsers, title: "Farmer Direct", desc: "Fair trade prices that support farming communities." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#FDF8F1] p-10 rounded-3xl"
              >
                <item.icon size={48} className="text-orange-600 mb-6" />
                <h3 className="text-3xl font-serif font-bold mb-4">{item.title}</h3>
                <p className="text-stone-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PROCESS */}
      <section id="process" className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif font-bold text-[#2D1606]">From Farm to Jar</h2>
          <p className="text-stone-500 mt-4">A journey of patience and respect for nature</p>
        </div>

        <div className="space-y-32">
          {[1,2,3].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <img 
                  src={`https://picsum.photos/id/${40 + i}/1200/800`} 
                  className="rounded-3xl shadow-xl" 
                  alt={`Step ${step}`} 
                />
              </div>
              <div>
                <div className="text-orange-600 text-6xl font-serif font-bold mb-6">0{step}</div>
                <h3 className="text-4xl font-serif font-bold mb-6">Step {step}: {["Harvest", "Traditional Processing", "Small Batch Packing"][step-1]}</h3>
                <p className="text-lg text-stone-600 leading-relaxed">
                  {step === 1 && "Carefully handpicked at peak ripeness by experienced farmers."}
                  {step === 2 && "Sun-dried or traditionally smoked using time-honored methods."}
                  {step === 3 && "Gently ground and packed by hand in small batches to preserve maximum flavor and aroma."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#2D1606] text-white py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-serif mb-16">What Our Community Says</h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="italic text-2xl leading-relaxed"
          >
            “The difference is night and day. My curries have never tasted this alive. 
            You can actually taste the love and care in every pinch.”
          </motion.div>
          <p className="mt-8 text-orange-200">- Priya Sharma, Home Chef & Food Blogger</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-b from-white to-[#FDF8F1]">
        <div className="max-w-3xl mx-auto text-center px-6">
          <FiSun size={80} className="text-orange-500 mx-auto mb-8" />
          <h2 className="text-6xl font-serif leading-none mb-8">Ready to transform your cooking?</h2>
          <p className="text-xl text-stone-600 mb-12">Join thousands of homes cooking with intention and purity.</p>
          <motion.a
            href="/products"
            whileHover={{ scale: 1.05 }}
            className="inline-block px-16 py-7 bg-[#2D1606] text-white rounded-3xl text-xl font-semibold"
          >
            Shop Our Collection
          </motion.a>
        </div>
      </section>
    </div>
  );
};

export default Home;