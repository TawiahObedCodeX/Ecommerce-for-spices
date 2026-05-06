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
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [reference]);

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center pt-20 pb-32 px-6">
      <div className="text-center max-w-lg">
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: [0, 1.15, 1], rotate: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mx-auto w-40 h-40 bg-linear-to-br from-amber-400 via-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl mb-10 ring-8 ring-orange-200"
          >
            <FiCheckCircle className="text-white" size={92} />
          </motion.div>
        </AnimatePresence>

        <h1 className="text-6xl font-black text-[#2D1606] mb-3">Payment Successful!</h1>
        <p className="text-2xl text-orange-600 font-medium mb-8">Thank you for your purchase</p>

        {reference && (
          <div className="bg-white rounded-3xl p-6 mb-10 shadow-sm">
            <p className="text-stone-500 text-sm">Transaction Reference</p>
            <p className="font-mono font-bold text-lg text-[#2D1606]">{reference}</p>
          </div>
        )}

        {order && (
          <div className="text-left bg-white rounded-3xl p-8 mb-10">
            <p className="font-medium">Customer: {order.customer_name}</p>
            <p className="font-medium">Total Paid: GHS {parseFloat(order.total_amount).toFixed(2)}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Link
            to="/products"
            className="flex items-center justify-center gap-3 py-6 bg-[#2D1606] hover:bg-orange-600 text-white font-black text-lg rounded-3xl transition-all"
          >
            <FiShoppingBag /> Continue Shopping
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-3 py-6 border-2 border-[#2D1606] text-[#2D1606] font-black text-lg rounded-3xl"
          >
            <FiHome /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;