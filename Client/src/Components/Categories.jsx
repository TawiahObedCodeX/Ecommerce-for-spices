import { GrStar } from "react-icons/gr";
import { motion } from 'framer-motion'; // Install framer-motion for smooth animations
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

  const hoverAnimation = isMobile 
    ? { scale: 1.05, transition: { duration: 0.3 } }
    : { 
        rotateY: 360, 
        transition: { duration: 1, ease: "easeInOut" } 
      };

  return (
    <div className="flex flex-col justify-center  items-center mt-12">
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
        <motion.div 
          className="flex flex-col items-center gap-2"
          variants={itemVariants}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={hoverAnimation}
        >
          <motion.img
            src="https://i.pinimg.com/1200x/ca/8e/e7/ca8ee794d73a7438843ec224aafe4414.jpg"
            alt=""
            className="w-50 h-50 rounded-full"
            whileHover={{ rotate: 5, scale: 1.1 }}
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
        </motion.div>
        <motion.div 
          className="flex flex-col items-center gap-2"
          variants={itemVariants}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={hoverAnimation}
        >
          <motion.img
            src="https://i.pinimg.com/1200x/e5/27/15/e527156003e6f61810ce8a19b3ea96e8.jpg"
            alt=""
            className="w-50 h-50 rounded-full"
            whileHover={{ rotate: 5, scale: 1.1 }}
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
        </motion.div>
        <motion.div 
          className="flex flex-col items-center gap-2"
          variants={itemVariants}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={hoverAnimation}
        >
          <motion.img
            src="https://i.pinimg.com/1200x/e2/e1/de/e2e1def0a8caf9034d7de992067f1efe.jpg"
            alt=""
            className="w-50 h-50 rounded-full"
            whileHover={{ rotate: 5, scale: 1.1 }}
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
        </motion.div>
        <motion.div 
          className="flex flex-col items-center gap-2"
          variants={itemVariants}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={hoverAnimation}
        >
          <motion.img
            src="https://i.pinimg.com/1200x/10/ca/56/10ca5609fbf45b00400d74fc2dbeb2c1.jpg"
            alt=""
            className="w-50 h-50 rounded-full"
            whileHover={{ rotate: 5, scale: 1.1 }}
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
        </motion.div>
        <motion.div 
          className="flex flex-col items-center gap-2"
          variants={itemVariants}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={hoverAnimation}
        >
          <motion.img
            src="https://i.pinimg.com/1200x/36/5b/3d/365b3d604700046658dcd3341e9a7108.jpg"
            alt=""
            className="w-50 h-50 rounded-full"
            whileHover={{ rotate: 5, scale: 1.1 }}
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
        </motion.div>
      </motion.div>
      
      {/* spices logo  */}
      <motion.div 
        className=" mt-32 flex flex-wrap justify-center gap-14"
        style={{ perspective: 1000 }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {[
          {
            name: (
              <h1 className="font-playfair-display-italic tracking-tighter  text-xl">
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
                Senamon powder
                <br />
                add to cart
              </h1>
            ),
            image: "https://i.pinimg.com/1200x/05/1e/97/051e97d25d621254c90893e9752bb8ee.jpg",
            bgcolor: "#fce3f5",
          },
        ].map(
          (
            item,
            index // Fixed: (item, index) — item is now the object
          ) => (
            <motion.div
              key={index}
              className=" rounded-lg h-[40vh] w-[25vw]  flex flex-col  justify-center items-center " // Tailwind for layout; add width if needed (e.g., w-64)
              style={{ 
                backgroundColor: item.bgcolor,
                transformStyle: 'preserve-3d'
              }}
              variants={cardVariants}
              whileHover={hoverAnimation}
            >
              <div className=" flex  justify-centery  items-center gap-7  mt-5">
                <div>
                  {item.name}
                </div>
                <motion.img 
                  src={item.image} 
                  alt="" 
                  className="w-40 h-40" 
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
               <div className="mt-6">
                 <motion.button 
                   className="bg-black text-white px-7 py-2 rounded-lg  cursor-pointer"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   shop now
                 </motion.button>
               </div>
              {/* If you add images later: <img src={item.image} alt="" className="w-20 h-20" /> */}
            </motion.div>
          )
        )}
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

       <motion.div 
         className=" mt-32 flex flex-wrap justify-center gap-14"
         style={{ perspective: 1000 }}
         variants={containerVariants}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, amount: 0.2 }}
       >
        {[
          {
            name: (
              <h1 className="font-playfair-display-italic tracking-tighter  text-xl">
              product 1
              </h1>
            ),
            image:
              "https://i.pinimg.com/1200x/25/85/db/2585db203b377e7a6aa9549252bfb968.jpg",
             prices:"Gh200"
          },
          {
            name: (
              <h1 className="font-playfair-display-italic text-xl ">
                 product 2
              </h1>
            ),
            image: "https://i.pinimg.com/1200x/e7/18/5d/e7185d2fbdd5bdfbcd462eba190e1eaf.jpg",
             prices:"Gh200"
          },
          {
            name: (
              <h1 className="font-playfair-display-italic text-xl">
              product 3
              </h1>
            ),
            image: "https://i.pinimg.com/1200x/5d/f9/64/5df964f13335351e47ac01d4d82c18be.jpg",
            prices:"Gh200"
          
          },
        ].map(
          (
            item,
            index // Fixed: (item, index) — item is now the object
          ) => (
            <motion.div
              key={index}
              className="  flex flex-col  justify-center items-center " // Tailwind for layout; add width if needed (e.g., w-64)
              variants={cardVariants}
              style={{ transformStyle: 'preserve-3d' }}
              whileHover={hoverAnimation}
            >
            <motion.div 
              className=" bg-gray-100 h-[30vh] w-[25vw] rounded-tl-lg rounded-tr-lg  flex flex-col  justify-center items-center  "
              whileHover={{ scale: 1.05 }}
            >
             <motion.img 
               src={item.image} 
               alt="" 
               className="w-40 h-40" 
               whileHover={{ scale: 1.1 }}
               transition={{ duration: 0.3 }}
             />
            </motion.div>
            <motion.div 
              className=" bg-gray-200/15 h-[10vh] w-[25vw] flex flex-col justify-center items-center"
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
                      <GrStar  className="text-2xl text-amber-300"/>
                       <GrStar  className="text-2xl text-amber-300"/>
                        <GrStar  className="text-2xl text-amber-300"/>
                         <GrStar  className="text-2xl text-amber-300"/>
                    </motion.div>
                  </div>
            </motion.div>  
            </motion.div>
          )
        )}
      </motion.div>
    </div>
  );
}