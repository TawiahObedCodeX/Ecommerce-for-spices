import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerWhatsapp, setBuyerWhatsapp] = useState("");

  const handlePaystackPayment = () => {
    if (cartItems.length === 0) return;
    if (!buyerName || !buyerEmail) {
      alert("Please enter your name and email");
      return;
    }

    const amountInPesewas = Math.round(totalPrice * 100);

    if (!window.PaystackPop) {
      alert("Payment system not loaded. Please refresh the page.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, // ✅ ENV Key
      email: buyerEmail,
      amount: amountInPesewas,
      currency: "GHS",
      ref: `melo_${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: buyerName },
          { display_name: "WhatsApp", variable_name: "whatsapp", value: buyerWhatsapp || "Not provided" },
        ],
      },
      callback: function (response) {
        alert(`✅ Payment successful!\nReference: ${response.reference}`);
        clearCart();
      },
      onClose: function () {
        console.log("Payment window closed.");
      },
    });

    handler.openIframe();
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-[80vh] flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center max-w-md px-6">
          <div className="text-8xl mb-8">🛍️</div>
          <h2 className="text-4xl font-black text-[#2D1606] mb-4">Your cart is empty</h2>
          <p className="text-[#2D1606]/70 text-lg mb-10">No payments have been made yet (0 so far)</p>
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
    <div className="pt-32 pb-20 bg-[#FFF8F0] min-h-screen flex items-center">
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
                        >
                          −
                        </button>
                        <span className="px-8 py-3 font-semibold text-lg border-x border-stone-300">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-5 py-3 text-2xl font-black hover:bg-stone-100 active:bg-stone-200"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
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
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-stone-500">Full Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-stone-500">Email Address</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-stone-500">WhatsApp Number (optional)</label>
                  <input
                    type="tel"
                    value={buyerWhatsapp}
                    onChange={(e) => setBuyerWhatsapp(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl border border-stone-200 focus:border-orange-500 outline-none text-lg"
                    placeholder="024 459 7912"
                  />
                </div>

                <div className="pt-8 border-t border-stone-100">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-2xl font-black text-[#2D1606]">Total Amount</span>
                    <span className="text-4xl font-black text-orange-600">GHS {totalPrice.toFixed(2)}</span>
                  </div>

                  <p className="text-sm text-stone-500 mb-8 leading-relaxed">
                    Secure payment via Paystack.<br />
                    All networks supported: MTN Mobile Money, Vodafone Cash, AirtelTigo Money, Credit Card, Mastercard & Bank Transfer.
                  </p>

                  <button
                    onClick={handlePaystackPayment}
                    className="w-full py-7 bg-[#2D1606] hover:bg-orange-600 text-white font-black text-xl rounded-3xl transition-all active:scale-[0.985]"
                  >
                    PAY GHS {totalPrice.toFixed(2)} SECURELY
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