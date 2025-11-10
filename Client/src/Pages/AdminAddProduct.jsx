import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiVideo, FiStar, FiDollarSign, FiCheck, FiTag, FiAlignLeft, FiList } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const hoverVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const focusVariants = {
  focus: {
    scale: 1.01,
    boxShadow: "0 0 0 4px rgba(251, 146, 60, 0.2)",
    transition: { duration: 0.2 },
  },
};

export default function AdminAddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    rating: 0,
    image: null,
    video: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ['Powders', 'Whole Spices', 'Blends', 'Herbs', 'Seasonings'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
        setFormData((prev) => ({ ...prev, image: file }));
      } else if (type === 'video' && file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert('Video must be 30 seconds or less. Please trim and try again.');
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => setVideoPreview(ev.target.result);
          reader.readAsDataURL(file);
          setFormData((prev) => ({ ...prev, video: file }));
        };
        video.src = URL.createObjectURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || formData.rating === 0 || !formData.image || !formData.video) {
      alert('Please fill all required fields.');
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <div className=" bg-white  px-4 sm:px-6 lg:px-">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center "
        >
          <motion.h1
            className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            Add New Spice Delight
          </motion.h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto ">
            Ignite flavors with every addition. Stunning visuals and crisp details to hook customers and spark shares.
          </p>
        </motion.div>

        {/* Form Grid */}
        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 bg-white rounded-3xl overflow-hidden p-4 sm:p-6 lg:p-12"
        >
          {/* Left Column: Basic Info */}
          <motion.div className="space-y-6 lg:col-span-1" variants={itemVariants}>
            {/* Product Name */}
            <motion.div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiTag className="mr-2 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                Product Name *
              </label>
              <motion.input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Fiery Chili Powder"
                required
                variants={focusVariants}
                whileFocus="focus"
                className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 transition-all duration-500 text-lg placeholder-gray-400"
              />
            </motion.div>

            {/* Category */}
            <motion.div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiList className="mr-2 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                Category *
              </label>
              <motion.select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                variants={focusVariants}
                whileFocus="focus"
                className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 transition-all duration-500 text-lg"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </motion.select>
            </motion.div>

            {/* Description */}
            <motion.div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiAlignLeft className="mr-2 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                Product Description
              </label>
              <motion.textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the aroma, heat level, origin, and suggested uses to entice your customers..."
                rows={4}
                variants={focusVariants}
                whileFocus="focus"
                className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 transition-all duration-500 text-lg placeholder-gray-400 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Share the story behind the spice to build connection.</p>
            </motion.div>
          </motion.div>

          {/* Middle Column: Pricing & Rating */}
          <motion.div className="space-y-6 lg:col-span-1" variants={itemVariants}>
            {/* Rating */}
            <motion.div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiStar className="mr-2 text-orange-500 group-hover:animate-bounce" />
                Product Rating (out of 5) *
              </label>
              <motion.div
                variants={hoverVariants}
                whileHover="hover"
                className="flex items-center space-x-1 p-4 bg-orange-50 rounded-2xl"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer transition-all duration-300 text-2xl ${
                      formData.rating >= star ? 'text-orange-500 fill-current' : 'text-gray-300'
                    }`}
                    onClick={() => handleRatingChange(star)}
                  >
                    <FiStar />
                  </motion.div>
                ))}
              </motion.div>
              <p className="text-sm text-gray-500 mt-2">Set initial rating to tantalize taste buds.</p>
            </motion.div>

            {/* Price */}
            <motion.div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiDollarSign className="mr-2 text-orange-500 group-hover:rotate-12 transition-transform duration-300" />
                Price (GHS) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-orange-500 text-xl">
                  ¢
                </span>
                <motion.input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 25.00"
                  step="0.01"
                  min="0"
                  required
                  variants={focusVariants}
                  whileFocus="focus"
                  className="w-full pl-14 px-6 py-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 transition-all duration-500 text-lg placeholder-gray-400"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div className="pt-8">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                transition={{ duration: 0.3 }}
                className={`w-full px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed scale-95'
                    : 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 text-white'
                } flex items-center justify-center space-x-3 group`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="rounded-full h-6 w-6 border-b-2 border-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Spicing Up...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="text-xl group-hover:animate-bounce" />
                    <span>Launch This Spice</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column: Media Uploads */}
          <motion.div className="space-y-6 lg:col-span-1" variants={itemVariants}>
            {/* Image Upload */}
            <motion.div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiImage className="mr-2 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                Product Image *
              </label>
              <motion.div
                variants={hoverVariants}
                whileHover="hover"
                className="border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center hover:border-orange-500 transition-all duration-500 cursor-pointer bg-gradient-to-br from-orange-50 to-red-50"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="hidden"
                  id="image-upload"
                  required
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <AnimatePresence mode="wait">
                    {imagePreview ? (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="space-y-3"
                      >
                        <motion.img
                          src={imagePreview}
                          alt="Preview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-full h-52 object-cover rounded-xl mx-auto transform transition-transform duration-300"
                          whileHover={{ scale: 1.05 }}
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                          <FiCheck className="mx-auto text-green-500 text-3xl animate-pulse" />
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <motion.div
                          whileHover={{ rotate: 180, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <FiImage className="mx-auto text-6xl text-orange-400 mb-3" />
                        </motion.div>
                        <p className="text-gray-700 font-semibold text-lg">Drop in a Vibrant Shot</p>
                        <p className="text-sm text-gray-500">JPG, PNG • Up to 5MB</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </label>
              </motion.div>
            </motion.div>

            {/* Video Upload */}
            <motion.div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiVideo className="mr-2 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                Short Video (30s max) *
              </label>
              <motion.div
                variants={hoverVariants}
                whileHover="hover"
                className="border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center hover:border-orange-500 transition-all duration-500 cursor-pointer bg-gradient-to-br from-orange-50 to-red-50"
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                  className="hidden"
                  id="video-upload"
                  required
                />
                <label htmlFor="video-upload" className="cursor-pointer block">
                  <AnimatePresence mode="wait">
                    {videoPreview ? (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="space-y-3"
                      >
                        <motion.video
                          src={videoPreview}
                          controls
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-full h-52 object-cover rounded-xl mx-auto transition-transform duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          Your browser does not support the video tag.
                        </motion.video>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                          <FiCheck className="mx-auto text-green-500 text-3xl animate-pulse" />
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FiVideo className="mx-auto text-6xl text-orange-400 mb-3" />
                        </motion.div>
                        <p className="text-gray-700 font-semibold text-lg">Upload Flavor Burst</p>
                        <p className="text-sm text-gray-500">MP4 • 30s Max • Up to 50MB</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </label>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.form>

        {/* Success Message */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl text-center mx-auto max-w-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <FiCheck className="mx-auto text-green-500 text-4xl mb-3" />
              </motion.div>
              <p className="text-green-800 font-bold text-xl">Spice Added with Zest! Customers are craving it already.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}