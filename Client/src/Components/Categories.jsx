import { GrStar } from "react-icons/gr";
import { motion, useAnimation } from 'framer-motion'; // Added useAnimation import
import { useState, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// New reusable component for flippable/animatable cards
function FlippableCard({ children, className, variants, isMobile, style = {}, ...props }) {
  const controls = useAnimation();

  useEffect(() => {
    // Handle entrance animation via controls to avoid conflicts
    controls.start(variants?.visible || { opacity: 1, y: 0 });
  }, [controls, variants]);

  const handleHoverStart = () => {
    if (isMobile) {
      controls.start({ scale: 1.05, transition: { duration: 0.3 } });
    } else {
      controls.start({ 
        rotateY: 360, 
        scale: 1.02, // Slight scale for polish during spin
        transition: { duration: 1, ease: "easeInOut" } 
      });
    }
  };

  const handleHoverEnd = () => {
    if (isMobile) {
      controls.start({ scale: 1, transition: { duration: 0.3 } });
    } else {
      // Instant reset to 0 (visually identical to 360, no spin back, but smooth feel)
      controls.set({ rotateY: 0, scale: 1 });
    }
  };

  return (
    <motion.div
      className={className}
      animate={controls}
      style={{ ...style, transformStyle: 'preserve-3d' }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      variants={variants}
      initial="hidden"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default function Categories() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-[9rem]">
      {/* title  */}
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h1 
          className="font-playfair-display-bold-italic"
          variants={fadeInUpVariants}
        >
          See our Latest 
        </motion.h1>
        <motion.h1 
          className="font-playfair-display-bold-italic text-5xl"
          variants={slideInLeftVariants}
        >
          Shop by Categories{" "}
        </motion.h1>
      </motion.div>
      
      {/* spices logo  */}
      <motion.div 
        className="flex flex-wrap gap-4 mt-12 justify-center"
        style={{ perspective: 1000 }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {[
          "https://i.pinimg.com/1200x/ca/8e/e7/ca8ee794d73a7438843ec224aafe4414.jpg",
          "https://i.pinimg.com/1200x/e5/27/15/e527156003e6f61810ce8a19b3ea96e8.jpg",
          "https://i.pinimg.com/1200x/e2/e1/de/e2e1def0a8caf9034d7de992067f1efe.jpg",
          "https://i.pinimg.com/1200x/10/ca/56/10ca5609fbf45b00400d74fc2dbeb2c1.jpg",
          "https://i.pinimg.com/1200x/36/5b/3d/365b3d604700046658dcd3341e9a7108.jpg"
        ].map((src, index) => (
          <FlippableCard
            key={index}
            className="flex flex-col items-center gap-2"
            variants={itemVariants}
            isMobile={isMobile}
          >
            <motion.img
              src={src}
              alt={`Category ${index + 1}`}
              className="h-20 w-20 md:w-55 md:h-55 rounded-full" // Fixed: assuming w-50 was a typo; adjust as needed
              // Removed whileHover to avoid conflicts during card spin
              transition={{ duration: 0.3 }}
            />
            <motion.h1 
              className="font-playfair-display-bold-italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              local spices
            </motion.h1>
          </FlippableCard>
        ))}
      </motion.div>
      
      {/* Natural mix cards */}
      <motion.div 
        className="mt-32 flex flex-wrap justify-center gap-4 md:gap-14" // Responsive gap
        style={{ perspective: 1000 }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {[
          {
            name: (
              <h1 className="font-playfair-display-italic tracking-tighter text-xl">
                Natural mix
                <br />
                add to cart
              </h1>
            ),
            image:
              "https://i.pinimg.com/1200x/29/c1/23/29c123b447350a2df01f88b138a987d6.jpg",
            bgcolor: "#f7d9a6",
          },
          {
            name: (
              <h1 className="font-playfair-display-italic text-xl ">
                Tummeric mix
                <br />
                add to cart
              </h1>
            ),
            image: "https://i.pinimg.com/1200x/cb/af/b1/cbafb19663f02a76e2dedd0a2d383805.jpg",
            bgcolor: "#d1f7c6",
          },
          {
            name: (
              <h1 className="font-playfair-display-italic text-xl">
                Senamon 
                <br />
                add to cart
              </h1>
            ),
            image: "https://i.pinimg.com/1200x/05/1e/97/051e97d25d621254c90893e9752bb8ee.jpg",
            bgcolor: "#fce3f5",
          },
        ].map((item, index) => (
          <FlippableCard
            key={index}
            className="rounded-lg h-80 w-full max-w-xs mx-auto md:h-[40vh] md:w-[25vw] flex flex-col justify-center items-center" // Responsive height/width
            style={{ backgroundColor: item.bgcolor }}
            variants={cardVariants}
            isMobile={isMobile}
          >
            <div className="flex justify-center items-center gap-7 mt-5">
              <div>
                {item.name}
              </div>
              <motion.img 
                src={item.image} 
                alt="" 
                className="w-40 h-40" 
                // Removed whileHover to avoid conflicts during card spin
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mt-6">
              <motion.button 
                className="bg-black text-white px-7 py-2 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                shop now
              </motion.button>
            </div>
          </FlippableCard>
        ))}
      </motion.div>

      <motion.div 
        className="mt-24 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h1 
          className="font-playfair-display-bold-italic"
          variants={fadeInUpVariants}
        >
          See our Latest 
        </motion.h1>
        <motion.h1 
          className="font-playfair-display-bold-italic text-5xl"
          variants={slideInLeftVariants}
        >
          Orginic Product
        </motion.h1>
      </motion.div>

      {/* Organic products */}
      <motion.div 
        className="mt-32 flex flex-wrap justify-center gap-12 md:gap-20" // Responsive gap
        style={{ perspective: 1000 }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {[
          {
            name: (
              <h1 className="font-playfair-display-italic tracking-tighter text-xl">
                product 1
              </h1>
            ),
            image:
              "https://i.pinimg.com/1200x/25/85/db/2585db203b377e7a6aa9549252bfb968.jpg",
            prices: "Gh200"
          },
          {
            name: (
              <h1 className="font-playfair-display-italic text-xl ">
                product 2
              </h1>
            ),
            image: "https://i.pinimg.com/1200x/e7/18/5d/e7185d2fbdd5bdfbcd462eba190e1eaf.jpg",
            prices: "Gh200"
          },
          {
            name: (
              <h1 className="font-playfair-display-italic text-xl">
                product 3
              </h1>
            ),
            image: "https://i.pinimg.com/1200x/5d/f9/64/5df964f13335351e47ac01d4d82c18be.jpg",
            prices: "Gh200"
          },
        ].map((item, index) => (
          <FlippableCard
            key={index}
            className="flex flex-col justify-center items-center  w-full max-w-xs mx-auto md:w-[25vw]" // Responsive width
            variants={cardVariants}
            isMobile={isMobile}
          >
            <motion.div 
              className="bg-gray-100 h-48 w-full md:h-[30vh] md:w-[24vw] rounded-tl-lg rounded-tr-lg flex flex-col justify-center items-center" // Responsive height/width
              // Removed whileHover from this div
            >
              <motion.img 
                src={item.image} 
                alt="" 
                className="w-40 h-40" 
                // Removed whileHover to avoid conflicts during card spin
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div 
              className="bg-gray-200/15 h-16 w-full md:h-[14vh] md:w-[25vw] flex flex-col justify-center items-center " // Responsive height/width
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {item.name}
              <span className="font-bold">{item.prices}</span>
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                  className="flex justify-center"
                >
                  <GrStar className="text-2xl text-amber-300"/>
                  <GrStar className="text-2xl text-amber-300"/>
                  <GrStar className="text-2xl text-amber-300"/>
                  <GrStar className="text-2xl text-amber-300"/>
                </motion.div>
              </div>
            </motion.div>  
          </FlippableCard>
        ))}
      </motion.div>
    </div>
  );
}