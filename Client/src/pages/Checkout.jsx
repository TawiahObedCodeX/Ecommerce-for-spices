import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerWhatsapp, setBuyerWhatsapp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const res = await fetch(`${API_URL}/api/config/paystack-key`);
        const data = await res.json();
        if (data.publicKey) setPublicKey(data.publicKey);
      } catch (err) {
        console.error("Failed to fetch Paystack key:", err);
      }
    };
    fetchPublicKey();
  }, [API_URL]);

  useEffect(() => {
    if (!window.PaystackPop && publicKey) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [publicKey]);

  const generateIdempotencyKey = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${buyerEmail}`;
  };

  const handlePaystackPayment = async () => {
    if (cartItems.length === 0) {
      setPaymentError("Your cart is empty");
      return;
    }
    if (!buyerName.trim()) {
      setPaymentError("Please enter your full name");
      return;
    }
    if (!buyerEmail.trim() || !buyerEmail.includes("@")) {
      setPaymentError("Please enter a valid email address");
      return;
    }

    setPaymentError("");
    setIsProcessing(true);
    const idempotencyKey = generateIdempotencyKey();

    try {
      const initRes = await fetch(`${API_URL}/api/payment/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: buyerEmail.trim().toLowerCase(),
          name: buyerName.trim(),
          whatsapp: buyerWhatsapp.trim(),
          amount: totalPrice,
          cartItems: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          idempotencyKey
        })
      });

      const initData = await initRes.json();
      if (!initRes.ok) throw new Error(initData.error || "Initialization failed");

      if (!window.PaystackPop) throw new Error("Paystack not loaded yet");

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: buyerEmail.trim().toLowerCase(),
        amount: Math.round(totalPrice * 100),
        currency: "GHS",
        ref: initData.reference,
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: buyerName.trim() },
            { display_name: "WhatsApp", variable_name: "whatsapp", value: buyerWhatsapp.trim() || "Not provided" }
          ]
        },
        callback: async (response) => {
          try {
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference, idempotencyKey })
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              alert(`✅ Payment successful! Reference: ${response.reference}`);
              clearCart();
              window.location.href = `/order-success?reference=${response.reference}`;
            } else {
              alert(`⚠️ Payment received but pending verification. Reference: ${response.reference}`);
              clearCart();
              window.location.href = `/order-pending?reference=${response.reference}`;
            }
          } catch (err) {
            alert(`Payment completed but verification failed. Please contact support with reference: ${response.reference}`);
          }
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
        }
      });
      handler.openIframe();
    } catch (error) {
      console.error(error);
      setPaymentError(error.message);
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-[80vh] flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center max-w-md px-6">
          <div className="text-8xl mb-8">🛍️</div>
          <h2 className="text-4xl font-black text-[#2D1606] mb-4">Your cart is empty</h2>
          <Link to="/products" className="inline-block px-12 py-5 bg-[#2D1606] hover:bg-orange-600 text-white font-black text-lg rounded-3xl">
            Browse Our Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-[#FFF8F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <h1 className="text-5xl font-black text-center text-[#2D1606] mb-16">Checkout</h1>
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <h2 className="font-black text-3xl mb-8">Your Selected Items</h2>
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-6 bg-white p-8 rounded-3xl shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full md:w-40 h-40 object-cover rounded-2xl" />
                  <div className="flex-1">
                    <h3 className="font-black text-2xl mb-2">{item.name}</h3>
                    <p className="text-orange-600 font-medium text-xl">GHS {item.price} × {item.quantity}</p>
                    <div className="flex items-center gap-8 mt-6">
                      <div className="flex border rounded-2xl overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-5 py-3 text-2xl font-black">−</button>
                        <span className="px-8 py-3 font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-5 py-3 text-2xl font-black">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-600">Remove</button>
                    </div>
                  </div>
                  <div className="text-right font-black text-3xl self-center">GHS {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-white rounded-3xl p-10 shadow-xl">
              <h2 className="font-black text-3xl mb-10">Payment Details</h2>
              {paymentError && <div className="mb-6 p-4 bg-red-50 rounded-2xl text-red-600">{paymentError}</div>}
              <div className="space-y-8">
                <input type="text" placeholder="Full Name *" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full px-6 py-5 rounded-2xl border" disabled={isProcessing} />
                <input type="email" placeholder="Email Address *" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className="w-full px-6 py-5 rounded-2xl border" disabled={isProcessing} />
                <input type="tel" placeholder="WhatsApp (optional)" value={buyerWhatsapp} onChange={(e) => setBuyerWhatsapp(e.target.value)} className="w-full px-6 py-5 rounded-2xl border" disabled={isProcessing} />
                <div className="pt-8 border-t">
                  <div className="flex justify-between mb-8">
                    <span className="text-2xl font-black">Total</span>
                    <span className="text-4xl font-black text-orange-600">GHS {totalPrice.toFixed(2)}</span>
                  </div>
                  <button onClick={handlePaystackPayment} disabled={isProcessing || !publicKey} className="w-full py-7 bg-[#2D1606] hover:bg-orange-600 text-white font-black text-xl rounded-3xl disabled:opacity-50">
                    {isProcessing ? "Processing..." : `PAY GHS ${totalPrice.toFixed(2)} SECURELY`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;