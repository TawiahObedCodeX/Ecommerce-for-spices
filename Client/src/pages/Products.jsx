import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiShoppingBag, FiStar, FiLayers, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const ProductSkeleton = () => (
  <div className="min-h-screen bg-[#FDF8F1] pt-24 animate-pulse">
    <div className="w-full h-[85vh] bg-stone-200" />
    <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[500px] bg-stone-200 rounded-[4rem]" />
      ))}
    </div>
  </div>
);

const products = [
  {
    id: 1,
    name: "Handcrafted Leather Bag",
    price: 320,
    oldPrice: 380,
    image: "/images/product1.jpeg",
    rating: "4.9",
    desc: "Premium artisan leather with hand-stitched details from Ghana.",
  },
  // ... (rest of your products remain untouched)
  {
    id: 2,
    name: "Wooden Bead Necklace",
    price: 85,
    oldPrice: 105,
    image: "/images/product1.jpeg",
    rating: "4.8",
    desc: "Natural wood beads with brass accents, handmade in Accra.",
  },
  {
    id: 3,
    name: "Ceramic Coffee Mug Set",
    price: 145,
    oldPrice: 170,
    image: "/images/product1.jpeg",
    rating: "5.0",
    desc: "Hand-thrown ceramic set, microwave & dishwasher safe.",
  },
  {
    id: 4,
    name: "Woven Straw Basket",
    price: 95,
    oldPrice: 120,
    image: "/images/product1.jpeg",
    rating: "4.7",
    desc: "Traditional Ghanaian weaving technique with colorful accents.",
  },
  {
    id: 5,
    name: "Brass Earrings Pair",
    price: 65,
    oldPrice: 85,
    image: "/images/product1.jpeg",
    rating: "4.9",
    desc: "Hand-forged brass with natural stones, lightweight & elegant.",
  },
  {
    id: 6,
    name: "Embroidered Throw Pillow",
    price: 110,
    oldPrice: 135,
    image: "/images/product1.jpeg",
    rating: "4.8",
    desc: "Vibrant African-inspired embroidery on soft cotton.",
  },
];

const Products = () => {
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <ProductSkeleton />;

  return (
    <div className="bg-[#FDF8F1] min-h-screen pb-20 overflow-x-hidden">
      
      <section className="max-w-[1400px] mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center space-x-3 text-orange-600 mb-4">
              <FiLayers size={20} />
              <span className="font-black tracking-widest text-xs uppercase">The Collection</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-serif font-black text-[#2D1606] tracking-tighter">
              Curated <span className="italic text-orange-600">Aromas.</span>
            </h3>
          </div>
          <p className="text-stone-500 font-medium max-w-xs md:text-right italic leading-relaxed">
            Every grain is inspected under natural light to ensure 100% purity and color vibrance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-96 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 right-6 bg-white px-5 py-2 rounded-2xl text-xs font-bold tracking-widest shadow">
                  ORGANIC
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-8 right-8 w-16 h-16 bg-[#2D1606] text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-orange-600 transition-all opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0"
                >
                  <FiShoppingBag size={26} />
                </button>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <FiStar className="text-orange-500 fill-orange-500" size={18} />
                    <span className="text-sm font-medium text-stone-500">{product.rating}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 px-4 py-1 rounded-full">
                    New Batch
                  </span>
                </div>

                <h4 className="text-2xl font-serif font-bold text-[#2D1606] leading-tight mb-3">
                  {product.name}
                </h4>

                <p className="text-stone-600 text-[15px] leading-relaxed mb-6 line-clamp-2">
                  {product.desc}
                </p>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-serif font-bold text-[#2D1606]">
                      GHS {product.price}
                    </span>
                    {product.oldPrice && (
                      <span className="text-stone-400 text-sm line-through ml-3">
                        GHS {product.oldPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <a
                      href="tel:0539526814"
                      className="w-11 h-11 bg-stone-100 hover:bg-stone-200 rounded-2xl flex items-center justify-center transition"
                    >
                      <FiPhone size={20} />
                    </a>
                    <a
                      href="https://wa.me/233244597912?text=Hi%2C%20I'm%20interested%20in%20this%20product%20from%20MELO'S%20Artisan!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-stone-100 hover:bg-stone-200 rounded-2xl flex items-center justify-center transition"
                    >
                      <FaWhatsapp size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;