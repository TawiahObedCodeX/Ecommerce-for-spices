import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
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
    alert("Thank you! Your message has been received. We'll respond soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-[#FFF8F0] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-black text-[#2D1606] tracking-tighter mb-4">
            Let's Connect
          </h1>
          <p className="text-xl text-[#2D1606]/70 max-w-md mx-auto">
            Have a question or want to visit our workshop? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-xl"
          >
            <h2 className="text-3xl font-black text-[#2D1606] mb-8">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-500 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg"
                    placeholder="Kwame Mensah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-500 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-500 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg"
                  placeholder="Interested in your Leather Bags"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-500 mb-2">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-6 py-5 rounded-3xl border border-stone-200 focus:border-orange-500 outline-none text-lg resize-y"
                  placeholder="Hi, I would like to know more about..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-6 bg-[#2D1606] hover:bg-orange-600 text-white font-black text-lg rounded-3xl transition-all"
              >
                SEND MESSAGE
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info + Location */}
          <div className="lg:col-span-5 space-y-10">
            {/* Quick Contact Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl"
            >
              <h3 className="font-black text-2xl text-[#2D1606] mb-8">Get In Touch</h3>

              <div className="space-y-8">
                <a href="tel:0539526814" className="flex gap-5 group">
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <FiPhone size={28} />
                  </div>
                  <div>
                    <div className="text-sm text-stone-500">Call Us</div>
                    <div className="font-medium text-lg">053 952 6814</div>
                  </div>
                </a>

                <a href="https://wa.me/233244597912" target="_blank" rel="noopener noreferrer" className="flex gap-5 group">
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <FaWhatsapp size={28} />
                  </div>
                  <div>
                    <div className="text-sm text-stone-500">WhatsApp</div>
                    <div className="font-medium text-lg">024 459 7912</div>
                  </div>
                </a>

                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                    <FiClock size={28} />
                  </div>
                  <div>
                    <div className="text-sm text-stone-500">Business Hours</div>
                    <div className="font-medium">Mon - Sat: 9:00 AM - 6:00 PM</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <FiMapPin size={32} className="text-orange-600" />
                  <div>
                    <h3 className="font-black text-2xl text-[#2D1606]">Our Location</h3>
                    <p className="text-orange-600 font-medium">Kpone Katamansu</p>
                  </div>
                </div>

                <p className="text-[#2D1606]/80 leading-relaxed">
                  Kpon Katamansu New Bridge at Alaba Junction<br />
                  Greater Accra Region, Ghana
                </p>
              </div>

              {/* Embedded Google Map */}
              <div className="relative h-80 bg-stone-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.5!2d0.08151!3d5.74838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwNDQnNTQuMiJOIDDCsDA0JzUzLjQiRQ!5e0!3m2!1sen!2sgh!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MELO'S Artisan Location Map"
                  className="absolute inset-0"
                />
              </div>

              <div className="p-6 text-center">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Kpone+Katamansu+New+Bridge+at+Alaba+Junction+Accra+Ghana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  Open in Google Maps →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;