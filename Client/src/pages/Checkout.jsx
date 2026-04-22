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
  const [retryCount, setRetryCount] = useState(0);
  const [publicKey, setPublicKey] = useState("");

  // API URL - this is the only environment variable needed
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch Paystack public key from backend on component mount
  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const response = await fetch(`${API_URL}/api/config/paystack-key`);
        const data = await response.json();
        if (data.publicKey) {
          setPublicKey(data.publicKey);
        }
      } catch (error) {
        console.error("Failed to fetch Paystack key:", error);
      }
    };

    fetchPublicKey();
  }, [API_URL]);

  // Load Paystack script dynamically
  useEffect(() => {
    if (!window.PaystackPop && publicKey) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [publicKey]);

  // Generate unique ID for idempotency
  const generateIdempotencyKey = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${buyerEmail}`;
  };

  const handlePaystackPayment = async () => {
    // Validation
    if (cartItems.length === 0) {
      setPaymentError("Your cart is empty");
      return;
    }
    if (!buyerName.trim()) {
      setPaymentError("Please enter your full name");
      return;
    }
    if (!buyerEmail.trim()) {
      setPaymentError("Please enter your email address");
      return;
    }
    if (!buyerEmail.includes('@') || !buyerEmail.includes('.')) {
      setPaymentError("Please enter a valid email address");
      return;
    }

    setPaymentError("");
    setIsProcessing(true);

    const idempotencyKey = generateIdempotencyKey();

    try {
      // Step 1: Initialize payment on backend
      console.log("Initializing payment...");
      const initResponse = await fetch(`${API_URL}/api/payment/initialize`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey
        },
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
          idempotencyKey: idempotencyKey,
          returnUrl: window.location.origin + "/payment/callback"
        })
      });

      const initData = await initResponse.json();

      if (!initResponse.ok) {
        throw new Error(initData.error || "Payment initialization failed. Please try again.");
      }

      // Step 2: Ensure Paystack is loaded
      if (!window.PaystackPop) {
        throw new Error("Payment system is loading. Please wait a moment and try again.");
      }

      // Step 3: Open Paystack payment modal
      const handler = window.PaystackPop.setup({
        key: publicKey, // Using key from backend
        email: buyerEmail.trim().toLowerCase(),
        amount: Math.round(totalPrice * 100), // Convert to pesewas/cents
        currency: "GHS",
        ref: initData.reference,
        metadata: {
          custom_fields: [
            { 
              display_name: "Customer Name", 
              variable_name: "customer_name", 
              value: buyerName.trim() 
            },
            { 
              display_name: "WhatsApp", 
              variable_name: "whatsapp", 
              value: buyerWhatsapp.trim() || "Not provided" 
            },
            { 
              display_name: "Cart Items Count", 
              variable_name: "cart_count", 
              value: cartItems.length.toString() 
            }
          ]
        },
        callback: async (response) => {
          // Step 4: Verify payment on backend
          try {
            console.log("Payment callback received, verifying...");
            const verifyResponse = await fetch(`${API_URL}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: response.reference,
                idempotencyKey: idempotencyKey
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              // Payment successful
              alert(`✅ Payment Successful!\n\nReference: ${response.reference}\nAmount: GHS ${totalPrice.toFixed(2)}\n\nThank you for your purchase!`);
              clearCart();
              
              // Redirect to success page
              window.location.href = `/order-success?reference=${response.reference}&amount=${totalPrice}`;
            } else {
              // Payment received but verification pending
              alert(`⚠️ Payment Received!\n\nReference: ${response.reference}\n\nYour order is being processed. We'll send a confirmation email shortly.\n\nPlease save your reference number for tracking.`);
              clearCart();
              window.location.href = `/order-pending?reference=${response.reference}`;
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert(`Payment completed but verification is pending.\n\nReference: ${response.reference}\n\nPlease contact our support with this reference number.\n\nSupport: 0539526814 or WhatsApp 0244597912`);
          }
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
          console.log("Payment window closed by user");
          if (retryCount < 2) {
            const shouldRetry = window.confirm("Payment was not completed. Would you like to try again?");
            if (shouldRetry) {
              setRetryCount(prev => prev + 1);
              handlePaystackPayment();
            }
          }
        }
      });

      handler.openIframe();

    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
      
      // Auto retry for network errors
      if (retryCount < 2 && error.message.includes("network")) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          handlePaystackPayment();
        }, 2000);
      }
    }
  };

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-[80vh] flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center max-w-md px-6">
          <div className="text-8xl mb-8">🛍️</div>
          <h2 className="text-4xl font-black text-[#2D1606] mb-4">Your cart is empty</h2>
          <p className="text-[#2D1606]/70 text-lg mb-10">Add some beautiful products to your cart</p>
          <Link
            to="/products"
            className="inline-block px-12 py-5 bg-[#2D1606] hover:bg-orange-600 text-white font-black text-lg rounded-3xl transition-all active:scale-95"
          >
            Browse Our Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-[#FFF8F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <h1 className="text-5xl font-black text-center text-[#2D1606] mb-16 tracking-tight">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items Section */}
          <div className="lg:col-span-7">
            <h2 className="font-black text-3xl mb-8 text-[#2D1606]">Your Selected Items</h2>
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-6 bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full md:w-40 h-40 object-cover rounded-2xl shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-black text-2xl text-[#2D1606] mb-2">{item.name}</h3>
                    <p className="text-orange-600 font-medium text-xl">
                      GHS {item.price} × {item.quantity}
                    </p>
                    <div className="flex items-center gap-8 mt-6">
                      <div className="flex items-center border border-stone-300 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-5 py-3 text-2xl font-black hover:bg-stone-100 active:bg-stone-200"
                          disabled={isProcessing}
                        >
                          −
                        </button>
                        <span className="px-8 py-3 font-semibold text-lg border-x border-stone-300">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-5 py-3 text-2xl font-black hover:bg-stone-100 active:bg-stone-200"
                          disabled={isProcessing}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                        disabled={isProcessing}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-black text-3xl text-[#2D1606] self-center">
                    GHS {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-stone-100">
              <h2 className="font-black text-3xl mb-10 text-[#2D1606]">Payment Details</h2>
              
              {paymentError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-600 text-sm">{paymentError}</p>
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-stone-500">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg"
                    placeholder="Enter your full name"
                    disabled={isProcessing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-stone-500">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg"
                    placeholder="your@email.com"
                    disabled={isProcessing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-stone-500">
                    WhatsApp Number (optional)
                  </label>
                  <input
                    type="tel"
                    value={buyerWhatsapp}
                    onChange={(e) => setBuyerWhatsapp(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg"
                    placeholder="024 459 7912"
                    disabled={isProcessing}
                  />
                </div>

                <div className="pt-8 border-t border-stone-100">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-2xl font-black text-[#2D1606]">Total Amount</span>
                    <span className="text-4xl font-black text-orange-600">GHS {totalPrice.toFixed(2)}</span>
                  </div>

                  <p className="text-sm text-stone-500 mb-8 leading-relaxed">
                    🔒 Secure payment via Paystack<br />
                    💳 All networks supported: MTN Mobile Money, Vodafone Cash, AirtelTigo Money<br />
                    💳 Credit Card, Mastercard & Bank Transfer also accepted
                  </p>

                  <button
                    onClick={handlePaystackPayment}
                    disabled={isProcessing || cartItems.length === 0 || !publicKey}
                    className={`w-full py-7 bg-[#2D1606] hover:bg-orange-600 text-white font-black text-xl rounded-3xl transition-all active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </span>
                    ) : (
                      `PAY GHS ${totalPrice.toFixed(2)} SECURELY`
                    )}
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