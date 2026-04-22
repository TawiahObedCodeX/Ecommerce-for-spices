import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./context/CartContext";
import Footer from "./components/Footer";

// Layout Wrapper to keep Navbar and Footer on all pages
const Layout = () => {
  return (
    <div className="bg-[#FFF8F0] min-h-screen font-inter selection:bg-orange-200">
      <Navbar />
      <main>
        <Outlet />
        <Footer/>
      </main>
    </div>
  );
};

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home/>} />
        <Route path="products" element={<Products />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Checkout />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    )
  );

  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}