import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const AuthSkeleton = () => (
  <div className="h-screen w-full bg-[#FDF8F1] flex items-center justify-center p-6">
    <div className="w-full max-w-5xl h-[650px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex animate-pulse">
      <div className="hidden lg:block w-5/12 bg-stone-200" />
      <div className="w-full lg:w-7/12 p-16 space-y-10">
        <div className="h-12 bg-stone-100 rounded-2xl w-1/2" />
        <div className="space-y-6">
          <div className="h-16 bg-stone-100 rounded-3xl w-full" />
          <div className="h-16 bg-stone-100 rounded-3xl w-full" />
        </div>
        <div className="h-16 bg-stone-200 rounded-full w-full" />
      </div>
    </div>
  </div>
);

const Signup = () => {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <AuthSkeleton />;

  return (
    <div className="h-screen w-full bg-[#FDF8F1] flex items-center justify-center relative overflow-hidden font-inter">
      
      {/* BACKGROUND DECORATIONS (The "Spice Mist") */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200/50 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-200/40 rounded-full blur-[120px]" 
      />

      {/* MAIN CENTERED CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[95%] max-w-5xl h-[650px] bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(45,22,6,0.12)] flex overflow-hidden relative z-10 border border-white"
      >
        
        {/* LEFT BRAND SECTION: Immersive Visual */}
        <div className="hidden lg:flex w-5/12 bg-[#2D1606] relative p-12 flex-col justify-between overflow-hidden">
          {/* Animated Image Overlay */}
          <div className="absolute inset-0 opacity-50 transition-transform duration-[20s] hover:scale-110">
            <img 
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000" 
              className="w-full h-full object-cover" 
              alt="Artisan Spices"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2D1606]" />

          <div className="relative z-10">
            <motion.div 
              initial={{ x: -20 }} animate={{ x: 0 }}
              className="text-orange-400 font-serif text-3xl font-bold tracking-tighter"
            >
              Melo's<span className="text-white">.</span>
            </motion.div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-serif font-bold text-white leading-tight">
              A Pinch of <br /> <span className="text-orange-400">Pure Gold.</span>
            </h2>
            <div className="space-y-3">
              {[ "Ethically Sourced", "Organic Certified", "Hand-Packed" ].map((text, i) => (
                <div key={i} className="flex items-center text-orange-100/80 text-sm font-semibold tracking-wide">
                  <FiCheckCircle className="mr-3 text-orange-500" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION: Interactive Auth */}
        <div className="w-full lg:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-md mx-auto"
            >
              <div className="mb-8">
                <h1 className="text-4xl font-serif font-black text-[#2D1606]">
                  {isLogin ? "Welcome Back" : "Join the Atelier"}
                </h1>
                <p className="text-stone-400 mt-2 font-medium">
                  {isLogin ? "Sign in to access your curated spice pantry." : "Create an account for premium culinary access."}
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div className="relative group">
                    <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      className="w-full pl-14 pr-6 py-5 bg-stone-50 rounded-3xl border border-transparent focus:border-orange-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 transition-all font-bold text-[#2D1606] outline-none"
                    />
                  </div>
                )}

                <div className="relative group">
                  <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-600 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    className="w-full pl-14 pr-6 py-5 bg-stone-50 rounded-3xl border border-transparent focus:border-orange-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 transition-all font-bold text-[#2D1606] outline-none"
                  />
                </div>

                <div className="relative group">
                  <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-600 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="Password"
                    className="w-full pl-14 pr-6 py-5 bg-stone-50 rounded-3xl border border-transparent focus:border-orange-200 focus:bg-white focus:ring-[6px] focus:ring-orange-500/5 transition-all font-bold text-[#2D1606] outline-none"
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "#E3812C" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-[#2D1606] text-white rounded-3xl font-black tracking-widest shadow-xl shadow-orange-900/10 flex items-center justify-center space-x-3 transition-all"
                >
                  <span>{isLogin ? "SIGN IN" : "REGISTER"}</span>
                  <FiArrowRight size={18} />
                </motion.button>
              </form>

              {/* Social Login */}
              <div className="mt-8 flex items-center space-x-4">
                <button className="flex-1 flex items-center justify-center space-x-3 py-4 border border-stone-100 rounded-2xl hover:bg-stone-50 transition-all font-bold text-sm text-[#2D1606]">
                  <FcGoogle size={20} />
                  <span>Google</span>
                </button>
                <div className="w-px h-6 bg-stone-100" />
                <p className="text-sm font-medium text-stone-400">
                  {isLogin ? "New?" : "Member?"}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-orange-600 font-black hover:underline underline-offset-4"
                  >
                    {isLogin ? "Create" : "Login"}
                  </button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Micro-Brand Tag */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-stone-300 uppercase tracking-[0.4em] whitespace-nowrap">
            Secure Encryption • 2026 Edition
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;