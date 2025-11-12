import React from 'react'
import { motion } from 'framer-motion'
import { StarIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const ProductPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  const reviews = [
    {
      name: 'Emma R.',
      rating: 5,
      date: '3 weeks ago',
      text: 'This sauce is perfect for my family dinners. It\'s so easy to use and tastes amazing on pasta. They\'re very tasty and full of flavor!'
    },
    {
      name: 'Amy G.',
      rating: 4,
      date: '2 weeks ago',
      text: 'This sauce is incredibly versatile! Great on pizza or veggies. Each time, it adds just the right amount of flavor without overpowering. Using it on grilled veggies gives a nice kick, and it\'s a staple in my pantry now.'
    }
  ]

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Header - More polished with logo and search */}
      <motion.header
        variants={itemVariants}
        className="border-b border-gray-200 py-4 px-4 md:px-8 lg:px-16 flex items-center justify-between bg-white shadow-sm"
      >
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-green-600 transition-colors">Shop all</a>
          <a href="#" className="hover:text-green-600 transition-colors">Recipes</a>
          <a href="#" className="hover:text-green-600 transition-colors">About</a>
        </nav>
        <div className="text-2xl font-bold text-green-700 tracking-tight">Plateful</div>
        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block">
            <input 
              type="search" 
              placeholder="Search products..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L3 3m2 2h10M9 7v10m6-10v10M9 7h6m-6 0H3m6 0h12M17 7h2m-2 0h-2" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
          </button>
        </div>
      </motion.header>

      {/* Main Product Section - Enhanced with quantity selector and ingredients */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-12 px-4 md:px-8 lg:px-16 grid md:grid-cols-2 gap-12 lg:gap-20"
      >
        {/* Product Image - Larger and with zoom effect */}
        <motion.div variants={itemVariants} className="relative group">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Tomato & Bell Pepper Sauce Jar"
            className="w-full rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            New in Store
          </div>
        </motion.div>

        {/* Product Details - More detailed with ingredients and nutrition */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tomato & Bell Pepper Sauce</h1>
            <p className="text-gray-500 text-lg">Rich, vibrant sauce made with sun-ripened tomatoes and sweet bell peppers</p>
          </div>
          
          <div className="flex items-center space-x-1 text-yellow-400">
            {[...Array(4)].map((_, i) => <StarIcon key={i} className="w-5 h-5 fill-current" />)}
            <StarIcon className="w-5 h-5" />
            <span className="ml-2 text-gray-600">(4.8 • 123 reviews)</span>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed text-lg">
              A delicious addition to your pantry that’s packed with nutrients and flavor. Made with simple, wholesome ingredients, it’s perfect for quick weeknight dinners, cozy pasta nights, or as a base for creative recipes.
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 100% natural ingredients</li>
              <li>• Vegan & gluten-free</li>
              <li>• No added sugars or preservatives</li>
              <li>• 350g jar (serves 4-6)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold text-green-700">£2.50</span>
              <span className="text-sm text-gray-500 line-through">£3.00</span>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button className="px-3 py-2 hover:bg-gray-100">-</button>
                <span className="px-4 py-2 bg-white">1</span>
                <button className="px-3 py-2 hover:bg-gray-100">+</button>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full bg-green-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-800 transition-colors shadow-lg"
            >
              Add to Basket
            </motion.button>
          </div>

          <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-3 text-sm text-green-700">
            <TruckIcon className="w-5 h-5" />
            <span>Free delivery on orders over £25 • Estimated delivery: 2-3 days</span>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
            <p className="text-sm text-gray-600">Tomatoes (60%), Bell Peppers (20%), Onions, Garlic, Olive Oil, Sea Salt, Herbs (Basil, Oregano).</p>
          </div>
        </motion.div>
      </motion.section>

      {/* Usage Images and Links - More integrated */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-8 px-4 md:px-8 lg:px-16 bg-gray-50 border-t border-gray-200"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Pasta with sauce" className="rounded-lg shadow-md" />
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Sauce jar" className="rounded-lg shadow-md" />
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb2c2f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Pizza with sauce" className="rounded-lg shadow-md" />
          </div>
          <div className="flex justify-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-green-600 transition-colors flex items-center space-x-1">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>How to use</span>
            </a>
            <a href="#" className="hover:text-green-600 transition-colors">Shipping & returns</a>
            <a href="#" className="hover:text-green-600 transition-colors">Sustainability</a>
          </div>
        </div>
      </motion.section>

      {/* Farm to Jar Section - Enhanced with icons and better flow */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 md:px-8 lg:px-16 bg-green-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Fresh farm produce"
                className="w-full rounded-xl shadow-lg"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">From Farm to Jar</h2>
              <h3 className="text-xl font-semibold text-green-700 mb-4">How we repurpose good-quality produce</h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                At Plateful, we’re passionate about rescuing surplus and imperfect fruits and veggies straight from local farms. This not only reduces food waste but also creates delicious, nutrient-rich products that burst with natural flavor. Our meticulous process—from hand-selection to gentle cooking—ensures every jar captures the essence of the harvest while prioritizing sustainability.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-700 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Partnered with UK family farms for ethical sourcing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-700 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Zero-waste production: Every ingredient is utilized</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-700 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Carbon-neutral packaging and delivery</p>
                </div>
              </div>
              <a href="#" className="inline-flex items-center text-green-700 font-semibold hover:underline text-lg">
                Learn more about our impact →
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Customer Reviews Section - More detailed with avatars and full stars */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 md:px-8 lg:px-16 border-t border-gray-200"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Rating Snapshot - Enhanced with progress bars */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Rating Snapshot</h2>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-3xl font-bold text-green-700">4.8</span>
                  <div className="flex text-yellow-400 ml-4">
                    {[...Array(5)].map((_, i) => (
                      i < 4 ? <StarIcon key={i} className="w-5 h-5 fill-current" /> : <StarIcon key={i} className="w-5 h-5" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">Based on 123 verified reviews</p>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center space-x-3">
                    <span className="w-6 text-right text-sm font-medium">{stars} star{stars > 1 ? 's' : ''}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(90 - (5 - stars) * 10)}%` }}></div>
                    </div>
                    <span className="w-8 text-sm text-gray-600 text-right">{Math.round(123 * (1 - (5 - stars) * 0.1))}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews - With avatars and more content */}
            <motion.div variants={itemVariants} className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              {reviews.map((review, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                        {[...Array(5 - review.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-gray-300" />)}
                      </div>
                      <p className="text-sm text-gray-500">{review.name} • {review.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.text}</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Filter reviews</option>
                  <option>Most recent</option>
                  <option>Highest rating</option>
                </select>
                <button className="text-green-700 font-semibold hover:underline text-sm">
                  Add a review →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default ProductPage