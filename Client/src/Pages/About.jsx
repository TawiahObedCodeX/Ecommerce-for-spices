// About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent/20 to-amber/30"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10" />
        <motion.div 
          className="text-center px-4 z-10 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <motion.h1 
            className="font-playfair-display-extra-bold text-5xl md:text-7xl lg:text-8xl text-text-dark mb-6 leading-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Melo Organic Spices
          </motion.h1>
          <motion.p 
            className="font-montserrat-light text-lg md:text-xl lg:text-2xl text-charcoal mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Harvested from the earth's purest soils, our spices whisper stories of ancient traditions and timeless wellness. Discover a world where flavor meets purity.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.button 
              className="bg-secondary text-text-light px-8 py-4 rounded-full font-montserrat-semi-bold text-lg hover:bg-bronze hover:shadow-[0_0_20px_rgba(205,127,50,0.3)] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Discover Our Story
            </motion.button>
            <motion.button 
              className="border-2 border-accent text-accent px-8 py-4 rounded-full font-montserrat-semi-bold text-lg hover:bg-accent hover:text-text-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Premium Collection
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Our History Section */}
      <motion.section 
        className="py-20 px-4 md:px-8 lg:px-16 bg-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="font-playfair-display-bold text-4xl md:text-5xl text-text-dark mb-4">
              Our Rich History
            </h2>
            <p className="font-montserrat-medium text-xl text-charcoal max-w-3xl mx-auto">
              From humble beginnings in 1985 on a small family farm in Kerala, India, Melo Organic Spices has grown into a global beacon of sustainable spice cultivation. Over three decades, we've honored the ancient spice routes while embracing modern ethical practices.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <img 
                src="/api/placeholder/600/400" 
                alt="Spice Heritage" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </motion.div>
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              <h3 className="font-playfair-display-semi-bold text-3xl text-text-dark">
                Roots in Tradition
              </h3>
              <p className="font-montserrat-light text-lg text-charcoal leading-relaxed">
                Our founder, Tawiah Melody, drew from generations of spice knowledge passed down through his family. Starting with just five acres of cardamom and turmeric, we now partner with over 200 artisan farmers across Asia and Africa, preserving heirloom varieties and cultural recipes.
              </p>
              <ul className="space-y-2 font-montserrat-medium text-charcoal">
                <li className="flex items-center gap-2">• Founded in 1985</li>
                <li className="flex items-center gap-2">• 200+ Global Partners</li>
                <li className="flex items-center gap-2">• Heirloom Seed Preservation</li>
                <li className="flex items-center gap-2">• Cultural Recipe Archives</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission & Values */}
      <motion.section 
        className="py-20 px-4 md:px-8 lg:px-16 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="font-playfair-display-bold text-4xl md:text-5xl text-text-dark mb-4">
              Our Core Values
            </h2>
            <p className="font-montserrat-medium text-xl text-charcoal max-w-3xl mx-auto">
              Guided by principles of integrity, innovation, and harmony with nature, we craft spices that elevate every culinary and wellness journey.
            </p>
          </motion.div>

          <motion.div 
            className="grid lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              { icon: "🌿", title: "Absolute Purity", desc: "Every batch undergoes rigorous third-party lab testing for over 400 contaminants, ensuring unmatched organic integrity." },
              { icon: "⚖️", title: "Fair Trade Excellence", desc: "We pay 30% above market rates to farmers, investing in community education, healthcare, and women's empowerment programs." },
              { icon: "♻️", title: "Sustainability First", desc: "Carbon-neutral operations, regenerative agriculture, and 100% biodegradable packaging reduce our footprint to near zero." },
              { icon: "🔬", title: "Scientific Innovation", desc: "Collaborating with botanists and nutritionists, we develop spice blends backed by clinical studies for optimal health benefits." },
              { icon: "👥", title: "Community Impact", desc: "Our foundation has planted 1M+ trees and provided clean water to 50 villages, fostering long-term rural prosperity." },
              { icon: "🌍", title: "Global Heritage", desc: "Sourcing from 12 countries, we celebrate diverse spice traditions while promoting biodiversity and cultural preservation." }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="text-center p-6 rounded-2xl bg-card/50 hover:bg-accent/30 hover:border-rose-gold/20 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(183,110,121,0.1)] transform hover:-translate-y-2 border border-border/50"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="font-playfair-display-semi-bold text-2xl text-text-dark mb-2">
                  {value.title}
                </h3>
                <p className="font-montserrat-light text-charcoal leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Certifications Section */}
      <motion.section 
        className="py-20 px-4 md:px-8 lg:px-16 bg-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="font-playfair-display-bold text-4xl md:text-5xl text-text-dark mb-4">
              Certifications of Trust
            </h2>
            <p className="font-montserrat-medium text-xl text-charcoal max-w-3xl mx-auto">
              Our commitment to excellence is validated by the world's leading standards, giving you peace of mind with every purchase.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {[
              { name: "USDA Organic", desc: "Certified organic farming practices.", image: "/api/placeholder/150/100?text=USDA" },
              { name: "Fair Trade", desc: "Ethical sourcing and fair wages.", image: "/api/placeholder/150/100?text=Fair+Trade" },
              { name: "Non-GMO Project", desc: "Verified non-genetically modified.", image: "/api/placeholder/150/100?text=Non-GMO" },
              { name: "Kosher Certified", desc: "Meets strict kosher dietary laws.", image: "/api/placeholder/150/100?text=Kosher" }
            ].map((cert, index) => (
              <motion.div 
                key={index}
                className="text-center p-4 rounded-xl bg-background hover:bg-accent/20 transition-all duration-300 shadow-md hover:shadow-lg border border-border/30 hover:border-gold/30"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <img src={cert.image} alt={cert.name} className="mx-auto mb-2 h-16 w-auto filter brightness-110" />
                <h3 className="font-montserrat-semi-bold text-text-dark text-sm">{cert.name}</h3>
                <p className="font-montserrat-light text-charcoal text-xs">{cert.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="py-20 px-4 md:px-8 lg:px-16 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="font-playfair-display-bold text-4xl md:text-5xl text-text-dark mb-4">
              Meet Our Guardians of Flavor
            </h2>
            <p className="font-montserrat-medium text-xl text-charcoal max-w-3xl mx-auto">
              A passionate team of botanists, chefs, and sustainability experts dedicated to bringing the world's finest spices to your doorstep.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              { name: "Raj Melo", role: "Founder & Chief Spice Alchemist", image: "/api/placeholder/300/300?text=Raj", bio: "With 40 years in spice cultivation, Raj pioneered our regenerative farming techniques." },
              { name: "Dr. Lena Voss", role: "Head of R&D", image: "/api/placeholder/300/300?text=Lena", bio: "PhD in Botany, Lena develops innovative blends for modern wellness needs." },
              { name: "Marcus Hale", role: "Sustainability Director", image: "/api/placeholder/300/300?text=Marcus", bio: "Former UN advisor, Marcus ensures our global supply chain remains eco-conscious." }
            ].map((member, index) => (
              <motion.div 
                key={index}
                className="text-center rounded-2xl bg-card/50 p-6 hover:bg-accent/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-border/30"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <img src={member.image} alt={member.name} className="w-24 h-24 mx-auto rounded-full mb-4 object-cover ring-2 ring-accent/30" />
                <h3 className="font-playfair-display-semi-bold text-xl text-text-dark mb-1">{member.name}</h3>
                <p className="font-montserrat-medium text-secondary mb-3">{member.role}</p>
                <p className="font-montserrat-light text-charcoal text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-20 px-4 md:px-8 lg:px-16 bg-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="font-playfair-display-bold text-4xl md:text-5xl text-text-dark mb-4">
              Voices of Flavor
            </h2>
            <p className="font-montserrat-medium text-xl text-charcoal max-w-3xl mx-auto">
              Don't just take our word for it—hear from the chefs, healers, and home cooks who've transformed their lives with Melo spices.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              { quote: "Melo's turmeric changed my anti-inflammatory routine—pure gold in every jar!", name: "Dr. Sarah Kim, Nutritionist", rating: 5 },
              { quote: "The cardamom pods elevated my bakery to Michelin-star levels. Unmatched quality.", name: "Chef Elena Rossi", rating: 5 },
              { quote: "Sustainable and delicious—our family won't cook without Melo blends anymore.", name: "The Patel Family", rating: 5 }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="p-6 rounded-2xl bg-background/80 border border-border/50 hover:shadow-xl hover:border-rose-gold/20 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex text-success mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-2xl">★</span>
                  ))}
                </div>
                <p className="font-montserrat-italic text-charcoal italic mb-4">"{testimonial.quote}"</p>
                <p className="font-montserrat-semi-bold text-text-dark">{testimonial.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}