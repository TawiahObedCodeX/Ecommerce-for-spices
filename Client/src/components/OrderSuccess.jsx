import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiHome } from "react-icons/fi";

const CONFETTI_COLORS = ["#FF8C00", "#FFB300", "#F5A623", "#FF6B00", "#FF4500", "#FFD700"];

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
    ctx.fillRect(-this.size / 2, -this.size * 0.45, this.size, this.size * 0.9);
    ctx.restore();
  }
}

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch Order Details
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
  }, [reference, navigate, API_URL]);

  // Confetti Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    particlesRef.current = [
      ...Array.from({ length: 150 }, () => new ConfettiParticle(canvas, true)),
      ...Array.from({ length: 80 }, () => new ConfettiParticle(canvas, false)),
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particlesRef.current.forEach(p => {
        p.update();
        p.draw(ctx);
        if (p.y < canvas.height + 100) alive = true;
      });

      if (alive) animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#2D1606]">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1] pt-32 pb-20 relative overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      <div className="max-w-lg mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto w-40 h-40 bg-gradient-to-br from-[#2D1606] to-orange-600 rounded-full flex items-center justify-center mb-10 shadow-2xl"
        >
          <FiCheckCircle className="text-white" size={110} />
        </motion.div>

        <h1 className="text-5xl font-black text-[#2D1606] mb-4">Payment Successful!</h1>
        <p className="text-xl text-green-600 mb-10">Thank you for your purchase</p>

        {reference && (
          <div className="bg-white rounded-3xl p-8 mb-10 shadow">
            <p className="text-sm text-gray-500">Order Reference</p>
            <p className="font-mono font-bold text-lg break-all">{reference}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Link to="/products">
            <button className="w-full py-6 bg-[#2D1606] text-white rounded-3xl font-black text-lg hover:bg-orange-600 transition">
              Continue Shopping
            </button>
          </Link>
          <Link to="/">
            <button className="w-full py-6 border-2 border-[#2D1606] text-[#2D1606] rounded-3xl font-black text-lg">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;