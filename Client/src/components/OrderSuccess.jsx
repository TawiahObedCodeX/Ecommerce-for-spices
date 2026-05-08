import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiHome, FiHeart } from "react-icons/fi";

const CONFETTI_COLORS = [
  "#FF8C00", "#FFB300", "#F5A623", "#FF6B00", "#FF4500",
  "#FFD700", "#FFAA00", "#C19A6B", "#FFFFFF", "#F5EDE4"
];

class ConfettiParticle {
  constructor(canvas, isBurst) {
    this.canvas = canvas;
    this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    this.size = Math.random() * 11 + 6;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 9;
    this.gravity = 0.16 + Math.random() * 0.08;

    if (isBurst) {
      this.x = canvas.width / 2 + (Math.random() - 0.5) * 90;
      this.y = canvas.height * 0.35;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 21 + 11;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 14;
    } else {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height * 0.6;
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = Math.random() * 4 + 2;
    }
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fillRect(-this.size / 2, -this.size * 0.45, this.size, this.size * 0.9);
    ctx.restore();
  }
}

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buzzerFired, setBuzzerFired] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const isAnimatingRef = useRef(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch Order
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
        console.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [reference, navigate, API_URL]);

  // Trigger Celebration Once
  useEffect(() => {
    const t1 = setTimeout(() => setBuzzerFired(true), 400);
    const t2 = setTimeout(() => setShowContent(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Confetti Engine (Single Burst)
  useEffect(() => {
    if (!buzzerFired) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = [
      ...Array.from({ length: 160 }, () => new ConfettiParticle(canvas, true)),
      ...Array.from({ length: 90 }, () => new ConfettiParticle(canvas, false)),
    ];

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let stillAlive = false;

      particlesRef.current.forEach((p) => {
        p.update();
        p.draw(ctx);
        if (p.y < canvas.height + 100) stillAlive = true;
      });

      if (stillAlive && isAnimatingRef.current) {
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    loop();

    return () => {
      isAnimatingRef.current = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [buzzerFired]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#2D1606]">Celebrating your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1] pt-32 pb-20 relative overflow-hidden">
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ mixBlendMode: "multiply" }}
      />

      <div className="max-w-lg mx-auto px-6 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center w-full">

          {/* Golden Buzzer Celebration */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ scale: 0, rotate: -160 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 130, damping: 14 }}
                className="mx-auto mb-10 relative w-44 h-44"
              >
                <motion.div
                  animate={{ scale: [1, 1.35, 1] }}
                  transition={{ duration: 2.4, repeat: 1 }}
                  className="absolute inset-0 bg-linear-to-br from-[#F5A623] to-[#FF8C00] rounded-full opacity-25 blur-2xl"
                />

                <div className="w-full h-full bg-linear-to-br from-[#2D1606] to-[#3F2210] rounded-full flex items-center justify-center shadow-2xl relative z-10">
                  <FiCheckCircle className="text-[#F5A623]" size={108} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-[#F5A623] text-2xl font-medium">
                  Payment Confirmed Successfully
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order Details */}
          {showContent && reference && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-[#F5A623]/20 w-full"
            >
              <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">Reference</p>
              <p className="font-mono font-bold text-[#2D1606] break-all text-lg mb-8">{reference}</p>

              {order && (
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-xs text-stone-500">Customer</p>
                    <p className="font-semibold text-[#2D1606] mt-1">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">Total</p>
                    <p className="font-bold text-[#2D1606] mt-1">GHS {Number(order.total_amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">Status</p>
                    <p className="text-green-600 font-bold mt-1">SUCCESS</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Thank You Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-stone-600 mt-12 mb-14 max-w-sm mx-auto"
          >
            Thank you for choosing <span className="font-serif font-bold text-[#2D1606]">Melos</span>.
            Your pure spices are packed with care and heading to you.
          </motion.p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-sm mx-auto mb-10">
            <Link to="/products">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-7 bg-[#2D1606] text-white rounded-3xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl"
              >
                <FiShoppingBag /> Continue Shopping
              </motion.div>
            </Link>

            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-7 border-2 border-[#2D1606] text-[#2D1606] rounded-3xl font-bold text-lg flex items-center justify-center gap-3"
              >
                <FiHome /> Back to Home
              </motion.div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-12 flex items-center justify-center gap-2 text-[#F5A623]"
          >
            <FiHeart /> Made with passion for your kitchen
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;