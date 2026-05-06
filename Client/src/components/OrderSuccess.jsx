import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiHome } from "react-icons/fi";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!reference) {
      navigate("/products");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payment/order/${reference}`);
        const data = await res.json();
        if (data.success) setOrder(data.order);
      } catch (err) {
        console.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [reference, navigate]);

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center pt-20 pb-32 px-6">
      <div className="text-center max-w-lg">
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl mb-10"
          >
            <FiCheckCircle className="text-white" size={90} />
          </motion.div>
        </AnimatePresence>

        <h1 className="text-6xl font-black text-[#2D1606] mb-4">Payment Successful!</h1>
        <p className="text-2xl text-orange-600 mb-10">Thank you for shopping with us</p>

        {reference && (
          <div className="bg-white p-6 rounded-3xl mb-10 shadow">
            <p className="text-stone-500 text-sm">Reference</p>
            <p className="font-mono font-bold text-lg">{reference}</p>
          </div>
        )}

        {order && (
          <div className="bg-white p-8 rounded-3xl mb-10 text-left">
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Total:</strong> GHS {Number(order.total_amount).toFixed(2)}</p>
          </div>
        )}

        <div className="space-y-4">
          <Link to="/products" className="block w-full py-6 bg-[#2D1606] text-white font-black rounded-3xl hover:bg-orange-600 transition">
            <FiShoppingBag className="inline mr-2" /> Continue Shopping
          </Link>
          <Link to="/" className="block w-full py-6 border-2 border-[#2D1606] text-[#2D1606] font-black rounded-3xl">
            <FiHome className="inline mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;