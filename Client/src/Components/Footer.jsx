import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Shop", path: "/products" },
    { name: "Our Story", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Track Order", path: "#" },
  ];

  const socialLinks = [
    { icon: <FiInstagram size={22} />, url: "https://instagram.com/melosartisan" },
    { icon: <FiFacebook size={22} />, url: "https://facebook.com/melosartisan" },
    { icon: <FiTwitter size={22} />, url: "https://twitter.com/melosartisan" },
    { icon: <FaWhatsapp size={22} />, url: "https://wa.me/233244597912" },
  ];

  return (
    <footer className="bg-[#2D1606] text-white overflow-hidden relative">
      {/* Subtle top wave / divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-3 mb-8"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2D1606] font-serif font-bold text-3xl">
                M
              </div>
              <div>
                <div className="text-4xl font-serif font-black tracking-tighter">MELO'S</div>
                <div className="text-xs tracking-[0.3em] text-orange-400 font-medium">ARTISAN</div>
              </div>
            </motion.div>

            <p className="text-orange-100/70 max-w-md text-[15px] leading-relaxed mb-10">
              Handcrafted treasures from Ghana. Every piece is made with passion, 
              tradition, and the finest natural materials.
            </p>

            {/* Contact Info with hover animation */}
            <div className="space-y-6">
              <motion.a 
                href="tel:0539526814"
                className="flex items-center gap-4 group"
                whileHover={{ x: 8 }}
              >
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <FiPhone size={22} />
                </div>
                <div>
                  <div className="text-sm text-orange-300">Call Us</div>
                  <div className="font-medium">053 952 6814</div>
                </div>
              </motion.a>

              <motion.a 
                href="https://wa.me/233244597912"
                target="_blank"
                className="flex items-center gap-4 group"
                whileHover={{ x: 8 }}
              >
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <FaWhatsapp size={22} />
                </div>
                <div>
                  <div className="text-sm text-orange-300">WhatsApp</div>
                  <div className="font-medium">024 459 7912</div>
                </div>
              </motion.a>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                  <FiMapPin size={22} />
                </div>
                <div>
                  <div className="text-sm text-orange-300">Visit Us</div>
                  <div className="font-medium">Accra, Ghana</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="font-black tracking-widest text-orange-400 text-sm mb-8">EXPLORE</h4>
            <div className="flex flex-col gap-y-5">
              {footerLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className="text-lg hover:text-orange-400 transition-colors duration-300 font-medium block"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Newsletter + Social */}
          <div className="lg:col-span-4">
            <h4 className="font-black tracking-widest text-orange-400 text-sm mb-6">STAY IN TOUCH</h4>
            
            <p className="text-orange-100/70 mb-6 text-[15px]">
              Join our community and receive stories behind every creation.
            </p>

            <div className="relative mb-10">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white/10 border border-white/20 rounded-3xl px-7 py-5 text-white placeholder:text-orange-100/50 focus:outline-none focus:border-orange-500 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-500 px-8 py-3 rounded-3xl font-black text-sm tracking-widest transition-all"
              >
                JOIN
              </motion.button>
            </div>

            {/* Social Icons with hover lift */}
            <div className="flex gap-5">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-orange-600 rounded-2xl transition-all duration-300"
                  whileHover={{ y: -6, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-orange-100/60">
          <div>
            © {currentYear} MELO'S Artisan. All rights reserved.
          </div>
          <div className="flex gap-6 text-xs tracking-widest">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Shipping</Link>
          </div>
          <div className="text-[10px] tracking-[0.1em]">HANDCRAFTED IN GHANA WITH LOVE </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;