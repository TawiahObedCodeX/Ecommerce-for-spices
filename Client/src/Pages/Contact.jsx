import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been received. We'll respond shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-[#FDF8F1] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-px bg-orange-600" />
            <span className="uppercase text-xs font-black tracking-[0.3em] text-orange-600">Get In Touch</span>
            <div className="w-3 h-px bg-orange-600" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-[#2D1606] tracking-tighter leading-none">
            Let's Create<br />Something Beautiful Together
          </h1>
          <p className="mt-6 text-lg text-[#2D1606]/70 max-w-md mx-auto">
            Have questions about our artisan pieces or want to collaborate? We're just a message away.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-xl"
          >
            <h2 className="text-3xl font-black text-[#2D1606] mb-10">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-stone-500">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg transition-all"
                    placeholder="Kwame Mensah"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-stone-500">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg transition-all"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-stone-500">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg transition-all"
                  placeholder="Interested in your Leather Collection"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-stone-500">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={7}
                  className="w-full px-6 py-5 rounded-3xl border border-stone-200 focus:border-orange-500 outline-none text-lg resize-y transition-all"
                  placeholder="Hi Melo’s team, I would love to know more about..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 bg-[#2D1606] hover:bg-orange-600 text-white font-black text-lg rounded-3xl flex items-center justify-center gap-3 transition-all"
              >
                SEND MESSAGE
                <FiSend size={22} />
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info + Map */}
          <div className="lg:col-span-5 space-y-12">
            {/* Quick Contact Cards */}
            <div className="space-y-6">
              <motion.a
                href="tel:0539526814"
                whileHover={{ scale: 1.02 }}
                className="flex gap-6 items-center bg-white p-8 rounded-3xl shadow-sm group"
              >
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <FiPhone />
                </div>
                <div>
                  <div className="font-medium text-sm text-orange-600">CALL US</div>
                  <div className="text-2xl font-semibold text-[#2D1606]">053 952 6814</div>
                </div>
              </motion.a>

              <motion.a
                href="https://wa.me/233244597912"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="flex gap-6 items-center bg-white p-8 rounded-3xl shadow-sm group"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-green-600 group-hover:text-white transition-all">
                  <FaWhatsapp />
                </div>
                <div>
                  <div className="font-medium text-sm text-green-600">WHATSAPP</div>
                  <div className="text-2xl font-semibold text-[#2D1606]">024 459 7912</div>
                </div>
              </motion.a>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex gap-6 items-center bg-white p-8 rounded-3xl shadow-sm"
              >
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl">
                  <FiClock />
                </div>
                <div>
                  <div className="font-medium text-sm text-amber-600">BUSINESS HOURS</div>
                  <div className="text-[#2D1606]">Mon - Sat: 9:00 AM - 6:00 PM</div>
                </div>
              </motion.div>
            </div>

            {/* Location & Map */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="p-8 border-b">
                <div className="flex items-center gap-4 mb-4">
                  <FiMapPin className="text-orange-600" size={28} />
                  <div>
                    <div className="font-black text-xl text-[#2D1606]">Our Workshop</div>
                    <div className="text-sm text-stone-500">Katamanso New Bridge, Tema, Ghana</div>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="relative h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.5!2d0.08151!3d5.74838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwNDQnNTQuMiJOIDDCsDA0JzUzLjQiRQ!5e0!3m2!1sen!2sgh!4v1720000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MELO'S Artisan Location - Katamanso New Bridge, Tema"
                  className="rounded-b-3xl"
                />
              </div>

              <div className="p-6 text-center text-xs text-stone-500">
                Katamanso New Bridge Area • Near Tema • Greater Accra Region
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;