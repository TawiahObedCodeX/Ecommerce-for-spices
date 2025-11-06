// Contact.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', inquiryType: 'general' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    alert('Thank you! We\'ll get back to you soon.');
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'wholesale', label: 'Wholesale Partnership' },
    { value: 'media', label: 'Media & Press' },
    { value: 'support', label: 'Customer Support' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="relative h-96 flex items-center justify-center bg-gradient-to-br from-secondary/10 via-accent/10 to-amber/20"
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center opacity-5" />
        <motion.div 
          className="text-center z-10 px-4"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-playfair-display-extra-bold text-4xl md:text-6xl text-text-dark mb-4">
            Connect With Us
          </h1>
          <p className="font-montserrat-light text-xl text-charcoal max-w-2xl mx-auto">
            Whether you're a spice enthusiast, potential partner, or need assistance, our team is ready to spice up your day. Reach out today.
          </p>
        </motion.div>
      </motion.section>

      {/* Contact Info & Form */}
      <motion.section 
        className="py-20 px-4 md:px-8 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            className="space-y-8 lg:sticky lg:top-20"
            variants={itemVariants}
          >
            <h2 className="font-playfair-display-bold text-3xl text-text-dark mb-6">
              Reach Out Anytime
            </h2>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email Us", value: "hello@meloorganic.com", desc: "For general questions and partnerships." },
                { icon: Phone, label: "Call Us", value: "+1 (555) 123-4567", desc: "Mon-Fri 9AM-6PM EST for immediate assistance." },
                { icon: MapPin, label: "Visit Us", value: "123 Spice Lane, Organic Valley, CA 90210, USA", desc: "Open for tours by appointment." },
                { icon: Clock, label: "Business Hours", value: "Mon-Fri: 9AM-6PM | Sat: 10AM-4PM | Sun: Closed", desc: "Global support available 24/7 via email." }
              ].map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <motion.div 
                    key={index}
                    className="flex items-start gap-4 p-6 rounded-xl bg-card hover:bg-accent/20 transition-all duration-300 border border-border/50 hover:border-gold/20"
                    whileHover={{ x: 10 }}
                  >
                    <div className="text-2xl text-secondary mt-1 flex-shrink-0">
                      <IconComponent size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-montserrat-semi-bold text-text-dark mb-1">{contact.label}</p>
                      <p className="font-montserrat-medium text-charcoal">{contact.value}</p>
                      <p className="font-montserrat-light text-charcoal/70 text-sm mt-1">{contact.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Social Links */}
            <motion.div 
              className="pt-8 border-t border-border"
              variants={itemVariants}
            >
              <h3 className="font-playfair-display-semi-bold text-xl text-text-dark mb-4">Follow Our Journey</h3>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, href: "#", color: "text-rose-gold" },
                  { icon: Facebook, href: "#", color: "text-maroon" },
                  { icon: Twitter, href: "#", color: "text-charcoal" },
                  { icon: Youtube, href: "#", color: "text-success" }
                ].map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      className={`p-3 rounded-full bg-card hover:bg-accent/30 transition-all duration-300 shadow-md hover:shadow-bronze/20 ${social.color}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <h2 className="font-playfair-display-bold text-3xl text-text-dark mb-6">
              Share Your Thoughts
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="hidden"
                whileInView="visible"
                variants={itemVariants}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-4 border border-border rounded-xl font-montserrat-regular text-text-dark bg-card/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="p-4 border border-border rounded-xl font-montserrat-regular text-text-dark bg-card/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                  required
                />
              </motion.div>
              <motion.div 
                className="space-y-2"
                initial="hidden"
                whileInView="visible"
                variants={itemVariants}
              >
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full p-4 border border-border rounded-xl font-montserrat-regular text-text-dark bg-card/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                  required
                >
                  {inquiryTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </motion.div>
              <motion.div 
                className="space-y-2"
                initial="hidden"
                whileInView="visible"
                variants={itemVariants}
              >
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-4 border border-border rounded-xl font-montserrat-regular text-text-dark bg-card/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                  required
                />
              </motion.div>
              <motion.div 
                className="space-y-2"
                initial="hidden"
                whileInView="visible"
                variants={itemVariants}
              >
                <textarea
                  rows={6}
                  placeholder="Your Message (Tell us how we can help—whether it's a recipe idea, partnership proposal, or support query.)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 border border-border rounded-xl font-montserrat-regular text-text-dark bg-card/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 resize-none"
                  required
                />
              </motion.div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-text-light py-4 rounded-xl font-montserrat-semi-bold text-lg flex items-center justify-center gap-2 hover:bg-bronze disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(205,127,50,0.3)] transform hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="py-20 px-4 md:px-8 lg:px-16 bg-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="font-playfair-display-bold text-3xl md:text-4xl text-text-dark mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-montserrat-medium text-lg text-charcoal">
              Find quick answers to common queries. For more, drop us a line above.
            </p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            variants={containerVariants}
          >
            {[
              { q: "What makes Melo spices different?", a: "Our spices are single-origin, hand-harvested, and triple-tested for purity—far beyond standard organic certifications." },
              { q: "Do you offer international shipping?", a: "Yes, we ship to 150+ countries with carbon-neutral packaging and duties pre-calculated for seamless delivery." },
              { q: "Are your products suitable for vegan/vegetarian diets?", a: "Absolutely—all our spices are 100% plant-based, gluten-free, and free from additives or fillers." },
              { q: "How can I become a wholesale partner?", a: "Contact our team via the wholesale form; we offer tiered pricing starting at 500 units with exclusive blends." },
              { q: "What is your return policy?", a: "Unopened products can be returned within 30 days for a full refund. We also offer satisfaction guarantees on all orders." }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-background rounded-xl p-6 border border-border/50 hover:border-accent/30 transition-all duration-300"
                variants={itemVariants}
                initial={false}
                whileHover={{ scale: 1.01 }}
              >
                <details className="cursor-pointer">
                  <summary className="font-montserrat-semi-bold text-text-dark mb-2 list-none font-playfair-display-semi-bold">
                    {faq.q}
                  </summary>
                  <p className="font-montserrat-light text-charcoal mt-2 pl-4 border-l-2 border-accent/30">
                    {faq.a}
                  </p>
                </details>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter Signup */}
      <motion.section 
        className="py-20 px-4 md:px-8 lg:px-16 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair-display-bold text-3xl text-text-dark mb-4">
            Stay Spiced
          </h2>
          <p className="font-montserrat-medium text-lg text-charcoal mb-8">
            Join 50,000+ subscribers for exclusive recipes, farm updates, and 10% off your first order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 p-4 border border-border rounded-xl font-montserrat-regular text-text-dark bg-card/50 focus:outline-none focus:border-accent transition-all duration-300"
            />
            <button className="bg-secondary text-text-light px-8 py-4 rounded-xl font-montserrat-semi-bold hover:bg-bronze transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(205,127,50,0.2)]">
              Subscribe
            </button>
          </div>
        </div>
      </motion.section>

      {/* Map Section */}
      <motion.section 
        className="py-20 px-4 md:px-8 lg:px-16 bg-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair-display-bold text-3xl text-text-dark text-center mb-8">
            Our Global Footprint
          </h2>
          <p className="text-center font-montserrat-medium text-charcoal mb-12">
            From our headquarters in California to farms in India and Ethiopia, explore where the magic happens.
          </p>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border border-border/30">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.242!2d-73.987!3d40.7589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a8b54c703b%3A0x2cb1ed880c0198c5!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1630000000000"
              className="w-full h-full"
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}