import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Mock data for spices categories and buyers
const mockData = {
  categories: [
    {
      id: 1,
      name: 'Powders',
      color: '#EF4444', // Red-orange for fine powders
      products: [
        {
          id: 1,
          name: 'Cumin Powder',
          buyersCount: 45,
          buyers: [
            { 
              name: 'Alice Johnson', 
              age: 28, 
              date: '2025-11-08',
              month: 'November',
              year: 2025,
              weather: 'Partly Cloudy' 
            },
            { 
              name: 'Bob Smith', 
              age: 35, 
              date: '2025-11-09',
              month: 'November',
              year: 2025,
              weather: 'Sunny' 
            },
            { 
              name: 'Carol Davis', 
              age: 42, 
              date: '2025-11-10',
              month: 'November',
              year: 2025,
              weather: 'Light Rain' 
            },
          ],
          salesData: [
            { day: 'Mon', buyers: 12 },
            { day: 'Tue', buyers: 8 },
            { day: 'Wed', buyers: 15 },
            { day: 'Thu', buyers: 10 },
          ],
        },
        {
          id: 2,
          name: 'Turmeric Powder',
          buyersCount: 32,
          buyers: [
            { 
              name: 'David Wilson', 
              age: 31, 
              date: '2025-11-07',
              month: 'November',
              year: 2025,
              weather: 'Cloudy' 
            },
            { 
              name: 'Eva Brown', 
              age: 29, 
              date: '2025-11-08',
              month: 'November',
              year: 2025,
              weather: 'Partly Cloudy' 
            },
          ],
          salesData: [
            { day: 'Mon', buyers: 9 },
            { day: 'Tue', buyers: 7 },
            { day: 'Wed', buyers: 10 },
            { day: 'Thu', buyers: 6 },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Whole Spices',
      color: '#F59E0B', // Amber for whole, robust spices
      products: [
        {
          id: 3,
          name: 'Black Peppercorns',
          buyersCount: 28,
          buyers: [
            { 
              name: 'Frank Miller', 
              age: 37, 
              date: '2025-11-09',
              month: 'November',
              year: 2025,
              weather: 'Sunny' 
            },
            { 
              name: 'Grace Lee', 
              age: 26, 
              date: '2025-11-10',
              month: 'November',
              year: 2025,
              weather: 'Light Rain' 
            },
          ],
          salesData: [
            { day: 'Mon', buyers: 7 },
            { day: 'Tue', buyers: 9 },
            { day: 'Wed', buyers: 8 },
            { day: 'Thu', buyers: 4 },
          ],
        },
        {
          id: 4,
          name: 'Cloves',
          buyersCount: 51,
          buyers: [
            { 
              name: 'Henry Garcia', 
              age: 44, 
              date: '2025-11-08',
              month: 'November',
              year: 2025,
              weather: 'Partly Cloudy' 
            },
            { 
              name: 'Ivy Taylor', 
              age: 33, 
              date: '2025-11-11',
              month: 'November',
              year: 2025,
              weather: 'Overcast' 
            },
            { 
              name: 'Jack White', 
              age: 39, 
              date: '2025-11-12',
              month: 'November',
              year: 2025,
              weather: 'Sunny' 
            },
          ],
          salesData: [
            { day: 'Mon', buyers: 14 },
            { day: 'Tue', buyers: 12 },
            { day: 'Wed', buyers: 13 },
            { day: 'Thu', buyers: 12 },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'Blends',
      color: '#10B981', // Green for mixed blends
      products: [
        {
          id: 5,
          name: 'Curry Powder Blend',
          buyersCount: 19,
          buyers: [
            { 
              name: 'Kara Anderson', 
              age: 25, 
              date: '2025-11-10',
              month: 'November',
              year: 2025,
              weather: 'Light Rain' 
            },
          ],
          salesData: [
            { day: 'Mon', buyers: 5 },
            { day: 'Tue', buyers: 4 },
            { day: 'Wed', buyers: 6 },
            { day: 'Thu', buyers: 4 },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'Herbs',
      color: '#3B82F6', // Blue for fresh herbs
      products: [
        {
          id: 6,
          name: 'Dried Basil',
          buyersCount: 37,
          buyers: [
            { 
              name: 'Liam Chen', 
              age: 30, 
              date: '2025-11-09',
              month: 'November',
              year: 2025,
              weather: 'Sunny' 
            },
            { 
              name: 'Mia Rodriguez', 
              age: 27, 
              date: '2025-11-10',
              month: 'November',
              year: 2025,
              weather: 'Partly Cloudy' 
            },
            { 
              name: 'Noah Kim', 
              age: 41, 
              date: '2025-11-06',
              month: 'November',
              year: 2025,
              weather: 'Cloudy' 
            },
          ],
          salesData: [
            { day: 'Mon', buyers: 10 },
            { day: 'Tue', buyers: 11 },
            { day: 'Wed', buyers: 9 },
            { day: 'Thu', buyers: 7 },
          ],
        },
      ],
    },
    {
      id: 5,
      name: 'Seasonings',
      color: '#8B5CF6', // Purple for versatile seasonings
      products: [
        {
          id: 7,
          name: 'Garlic Salt',
          buyersCount: 26,
          buyers: [
            { 
              name: 'Olivia Martinez', 
              age: 34, 
              date: '2025-11-07',
              month: 'November',
              year: 2025,
              weather: 'Overcast' 
            },
            { 
              name: 'Ethan Lopez', 
              age: 29, 
              date: '2025-11-10',
              month: 'November',
              year: 2025,
              weather: 'Light Rain' 
            },
          ],
          salesData: [
            { day: 'Mon', buyers: 6 },
            { day: 'Tue', buyers: 8 },
            { day: 'Wed', buyers: 7 },
            { day: 'Thu', buyers: 5 },
          ],
        },
        {
          id: 8,
          name: 'Italian Seasoning',
          buyersCount: 41,
          buyers: [
            { 
              name: 'Sophia Nguyen', 
              age: 38, 
              date: '2025-11-08',
              month: 'November',
              year: 2025,
              weather: 'Sunny' 
            },
            { 
              name: 'Lucas Patel', 
              age: 32, 
              date: '2025-11-09',
              month: 'November',
              year: 2025,
              weather: 'Partly Cloudy' 
            },
          ],
          salesData: [
            { day: 'Mon', buyers: 11 },
            { day: 'Tue', buyers: 10 },
            { day: 'Wed', buyers: 12 },
            { day: 'Thu', buyers: 8 },
          ],
        },
      ],
    },
  ],
};

// Pie chart data for overall category distribution
const pieData = [
  { name: 'Powders', value: 77 },
  { name: 'Whole Spices', value: 79 },
  { name: 'Blends', value: 19 },
  { name: 'Herbs', value: 37 },
  { name: 'Seasonings', value: 67 },
];
const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 },
  },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

export default function AdminAnalytics() {
  const [selectedCategory, setSelectedCategory] = useState(mockData.categories[0]);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center"
        >
          Spices E-Commerce Analytics Dashboard
        </motion.h1>

        {/* Overall Pie Chart */}
        <motion.div
          variants={itemVariants}
          className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Category Buyer Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Category Sidebar */}
          <motion.aside className="lg:col-span-1">
            <motion.h2
              variants={itemVariants}
              className="text-xl font-semibold text-gray-700 mb-4"
            >
              Categories
            </motion.h2>
            <AnimatePresence>
              {mockData.categories.map((category) => (
                <motion.button
                  key={category.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full mb-2 p-3 rounded-lg shadow-sm transition-all duration-300 ${
                    selectedCategory.id === category.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.aside>

          {/* Main Content: Products and Buyers */}
          <motion.main className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory.id}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: selectedCategory.color }}
                  />
                  {selectedCategory.name} Overview
                </h2>

                {selectedCategory.products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                  >
                    {/* Product Header */}
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                          <p className="text-gray-600 mt-1">Total Buyers: {product.buyersCount}</p>
                        </div>
                        <motion.span
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                        >
                          {product.buyersCount} Buyers
                        </motion.span>
                      </div>

                      {/* Bar Chart for Daily Buyers */}
                      <div className="mt-4 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={product.salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="buyers" fill={selectedCategory.color} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Buyers Table */}
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">Recent Buyers</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Age
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Month
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Year
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Weather Condition
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {product.buyers.slice(0, 5).map((buyer, index) => (
                              <motion.tr
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {buyer.name}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {buyer.age}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {buyer.date}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {buyer.month}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {buyer.year}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {buyer.weather}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {product.buyers.length > 5 && (
                        <p className="text-sm text-gray-500 mt-2">Showing 5 of {product.buyers.length} buyers</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </motion.div>
    </div>
  );
}