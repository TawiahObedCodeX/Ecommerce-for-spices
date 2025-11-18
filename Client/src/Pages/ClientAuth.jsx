// ClientAuth.jsx - Centered form, no scroll, view switching via text links, forget password link in signup/login
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import spices from "../assets/Spiceslogo.png";
import Loading from "../Components/Loading";

const ClientAuth = () => {
  const [view, setView] = useState("signup"); // 'signup', 'login', 'forget', 'reset'
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    console.log("Form submitted:", { role: "client", view, data: formData });

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (view === "signup") {
      alert("Client account created successfully!");
      navigate("/dashbord-client");
    } else if (view === "login") {
      navigate("/dashbord-client");
    } else if (view === "forget") {
      alert("Reset link sent to your email!");
      setView("reset");
    } else if (view === "reset") {
      alert("Password reset successfully!");
      setView("login");
    }
    setFormData({
      fullName: "",
      age: "",
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
    });
    setIsLoading(false);
  };

  // Variants for form transitions
  const formVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  // Variants for title animation on view change
  const titleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const renderForm = () => {
    if (view === "signup") {
      return (
        <motion.form
          key="signup"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-2 sm:space-y-3 max-w-md w-full"
        >
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-montserrat-medium text-charcoal">
              Full Name
            </label>
            <motion.input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all shadow-sm text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-montserrat-medium text-charcoal">
              Age
            </label>
            <motion.input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all shadow-sm text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-montserrat-medium text-charcoal">
              Email Address
            </label>
            <motion.input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all shadow-sm text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-montserrat-medium text-charcoal">
              Password
            </label>
            <motion.input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all shadow-sm text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <p className="text-xs text-gray-500">6+ characters</p>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 mr-2 rounded"
              required
            />
            <label
              htmlFor="terms"
              className="text-xs font-montserrat-regular text-charcoal"
            >
              I agree to all statements included in the{" "}
              <a href="#" className="text-accent hover:underline">
                terms of service
              </a>
            </label>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-text-dark text-text-light py-2 sm:py-2.5 rounded-lg font-montserrat-semi-bold text-sm sm:text-base hover:bg-gray-800 transition-all shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Account
          </motion.button>
          <p className="text-center text-xs sm:text-sm text-charcoal mt-2 sm:mt-3">
            Already have an account?{" "}
            <button
              onClick={() => setView("login")}
              className="text-accent hover:underline font-montserrat-medium"
            >
              Sign in
            </button>
          </p>
          <p className="text-center text-xs sm:text-sm text-charcoal">
            <button
              onClick={() => setView("forget")}
              className="text-info hover:underline font-montserrat-medium"
            >
              Forgot password?
            </button>
          </p>
        </motion.form>
      );
    } else if (view === "login") {
      return (
        <motion.form
          key="login"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-2 sm:space-y-3 max-w-md w-full"
        >
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-montserrat-medium text-charcoal">
              Email Address
            </label>
            <motion.input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all shadow-sm text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-montserrat-medium text-charcoal">
              Password
            </label>
            <motion.input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all shadow-sm text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <p className="text-right text-xs sm:text-sm text-charcoal">
            <button
              onClick={() => setView("forget")}
              className="text-info hover:underline font-montserrat-medium"
            >
              Forgot password?
            </button>
          </p>
          <motion.button
            type="submit"
            className="w-full bg-text-dark text-text-light py-2 sm:py-2.5 rounded-lg font-montserrat-semi-bold text-sm sm:text-base hover:bg-gray-800 transition-all shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
          </motion.button>
          <p className="text-center text-xs sm:text-sm text-charcoal mt-2 sm:mt-3">
            Don't have an account?{" "}
            <button
              onClick={() => setView("signup")}
              className="text-accent hover:underline font-montserrat-medium"
            >
              Create one
            </button>
          </p>
        </motion.form>
      );
    } else if (view === "forget") {
      return (
        <motion.form
          key="forget"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-2 sm:space-y-3 max-w-md w-full"
        >
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-montserrat-medium text-charcoal">
              Email Address
            </label>
            <motion.input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all shadow-sm text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-info text-text-light py-2 sm:py-2.5 rounded-lg font-montserrat-semi-bold text-sm sm:text-base hover:bg-navy transition-all shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Reset Link
          </motion.button>
          <p className="text-center text-xs sm:text-sm text-charcoal">
            <button
              onClick={() => setView("login")}
              className="text-accent hover:underline font-montserrat-medium"
            >
              Back to Sign in
            </button>
          </p>
        </motion.form>
      );
    } else if (view === "reset") {
      return (
        <motion.form
          key="reset"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-2 sm:space-y-3 max-w-md w-full"
        >
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-montserrat-medium text-charcoal">
              New Password
            </label>
            <motion.input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all shadow-sm text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <p className="text-xs text-gray-500">6+ characters</p>
          </div>
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-montserrat-medium text-charcoal">
              Confirm New Password
            </label>
            <motion.input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all shadow-sm text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-info text-text-light py-2 sm:py-2.5 rounded-lg font-montserrat-semi-bold text-sm sm:text-base hover:bg-navy transition-all shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Password
          </motion.button>
          <p className="text-center text-xs sm:text-sm text-charcoal">
            <button
              onClick={() => setView("login")}
              className="text-accent hover:underline font-montserrat-medium"
            >
              Back to Sign in
            </button>
          </p>
        </motion.form>
      );
    }
    return null;
  };

  const renderRightContent = () => (
    <div className="flex flex-col justify-center items-center text-center px-2 py-4 sm:py-6">
      <motion.div
        className="relative w-full max-w-xs sm:max-w-sm overflow-hidden rounded-2xl mb-4 shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.img
          key="client-image"
          src={spices}
          alt="Exquisite Spices"
          className="w-full h-32 sm:h-48 lg:h-64 object-cover hidden sm:block"
          whileHover={{ scale: 1.05 }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
      </motion.div>
      <motion.h2
        className="font-playfair-display-bold text-lg sm:text-xl lg:text-3xl text-text-dark mb-2 sm:mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Elevate Your Kitchen
      </motion.h2>
      <motion.p
        className="font-montserrat-medium text-xs sm:text-sm lg:text-lg text-charcoal max-w-md leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Discover premium organic spices that transform every meal into a
        masterpiece.
      </motion.p>
    </div>
  );

  const getTitleText = () => {
    if (view === "signup") return "Sign up";
    if (view === "login") return "Sign in";
    if (view === "forget") return "Forgot Password";
    if (view === "reset") return "Reset Password";
    return "";
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-screen bg-background flex items-center justify-center px-2 sm:px-4 relative overflow-hidden">
      {/* Subtle luxury background pattern on white */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(220,20,60,0.05),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(34,139,34,0.05),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(80,200,120,0.05),transparent_50%)]"></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto h-full flex flex-col lg:flex-row items-center justify-center gap-2 sm:gap-4 lg:gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Right: Image + Text - Responsive and stacked on small screens (first on mobile) */}
        <motion.div
          className="lg:flex w-full lg:w-1/2 order-1 lg:order-2 flex justify-center flex-1"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {renderRightContent()}
        </motion.div>

        {/* Left: Form - Centered, no border, responsive height */}
        <motion.div
          className="w-full lg:w-1/2 order-2 lg:order-1 bg-background rounded-3xl p-1  sm:p-4  lg:p-8 flex flex-col justify-center items-center flex-1 min-h-0"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1
            key={view}
            className="font-playfair-display-bold text-sm sm:text-base  lg:text-2xl text-text-dark mb-0 sm:mb-4 lg:mb-6 text-center"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
          >
            {getTitleText()}
          </motion.h1>

          <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">{renderForm()}</AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClientAuth;
