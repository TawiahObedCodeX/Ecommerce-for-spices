// ClientAuth.jsx - Centered form, no scroll, view switching via text links, forget password link in signup/login
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientAuth = () => {
  const [view, setView] = useState('signup'); // 'signup', 'login', 'forget', 'reset'
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    newPassword: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log('Form submitted:', { role: 'client', view, data: formData });
    if (view === 'signup') {
      alert('Client account created successfully!');
      setView('login');
    } else if (view === 'login') {
      alert('Logged in successfully!');
      navigate('/dashboard');
    } else if (view === 'forget') {
      alert('Reset link sent to your email!');
      setView('reset');
    } else if (view === 'reset') {
      alert('Password reset successfully!');
      setView('login');
    }
    setFormData({ fullName: '', age: '', email: '', password: '', confirmPassword: '', newPassword: '' });
  };

  const renderForm = () => {
    if (view === 'signup') {
      return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
          <div className="space-y-1">
            <label className="block text-sm font-montserrat-medium text-[var(--color-charcoal)]">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
              required 
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-montserrat-medium text-[var(--color-charcoal)]">Age</label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
              required 
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-montserrat-medium text-[var(--color-charcoal)]">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
              required 
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-montserrat-medium text-[var(--color-charcoal)]">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
              required 
            />
            <p className="text-xs text-gray-500">6+ characters</p>
          </div>
          <div className="flex items-start">
            <input type="checkbox" id="terms" className="mt-1 mr-2 rounded" required />
            <label htmlFor="terms" className="text-xs font-montserrat-regular text-[var(--color-charcoal)]">
              I agree to all statements included in the <a href="#" className="text-[var(--color-accent)] hover:underline">terms of service</a>
            </label>
          </div>
          <motion.button 
            type="submit"
            className="w-full bg-[var(--color-text-dark)] text-[var(--color-text-light)] py-3 rounded-lg font-montserrat-semi-bold text-lg hover:bg-gray-800 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Account
          </motion.button>
          <div className="text-center">
            <p className="text-sm text-[var(--color-charcoal)]">or</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                <span className="text-sm font-montserrat-medium">Google</span>
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/LinkedIn_logo.png" alt="LinkedIn" className="w-5 h-5" />
                <span className="text-sm font-montserrat-medium">LinkedIn</span>
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-[var(--color-charcoal)] mt-4">
            Already have an account? <button onClick={() => setView('login')} className="text-[var(--color-accent)] hover:underline font-montserrat-medium">Sign in</button>
          </p>
          <p className="text-center text-sm text-[var(--color-charcoal)]">
            <button onClick={() => setView('forget')} className="text-[var(--color-info)] hover:underline font-montserrat-medium">Forgot password?</button>
          </p>
        </form>
      );
    } else if (view === 'login') {
      return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
          <div className="space-y-1">
            <label className="block text-sm font-montserrat-medium text-[var(--color-charcoal)]">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
              required 
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-montserrat-medium text-[var(--color-charcoal)]">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
              required 
            />
          </div>
          <p className="text-right text-sm text-[var(--color-charcoal)]">
            <button onClick={() => setView('forget')} className="text-[var(--color-info)] hover:underline font-montserrat-medium">Forgot password?</button>
          </p>
          <motion.button 
            type="submit"
            className="w-full bg-[var(--color-text-dark)] text-[var(--color-text-light)] py-3 rounded-lg font-montserrat-semi-bold text-lg hover:bg-gray-800 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
          </motion.button>
          <div className="text-center">
            <p className="text-sm text-[var(--color-charcoal)]">or</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                <span className="text-sm font-montserrat-medium">Google</span>
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/LinkedIn_logo.png" alt="LinkedIn" className="w-5 h-5" />
                <span className="text-sm font-montserrat-medium">LinkedIn</span>
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-[var(--color-charcoal)] mt-4">
            Don't have an account? <button onClick={() => setView('signup')} className="text-[var(--color-accent)] hover:underline font-montserrat-medium">Create one</button>
          </p>
        </form>
      );
    } else if (view === 'forget') {
      return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
          <div className="space-y-1">
            <label className="block text-sm font-montserrat-medium text-[var(--color-charcoal)]">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
              required 
            />
          </div>
          <motion.button 
            type="submit"
            className="w-full bg-[var(--color-info)] text-[var(--color-text-light)] py-3 rounded-lg font-montserrat-semi-bold text-lg hover:bg-[var(--color-navy)] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Reset Link
          </motion.button>
          <p className="text-center text-sm text-[var(--color-charcoal)]">
            <button onClick={() => setView('login')} className="text-[var(--color-accent)] hover:underline font-montserrat-medium">Back to Sign in</button>
          </p>
        </form>
      );
    } else if (view === 'reset') {
      return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
          <div className="space-y-1">
            <label className="block text-sm font-montserrat-medium text-[var(--color-charcoal)]">New Password</label>
            <input 
              type="password" 
              name="newPassword" 
              value={formData.newPassword} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
              required 
            />
            <p className="text-xs text-gray-500">6+ characters</p>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-montserrat-medium text-[var(--color-charcoal)]">Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
              required 
            />
          </div>
          <motion.button 
            type="submit"
            className="w-full bg-[var(--color-info)] text-[var(--color-text-light)] py-3 rounded-lg font-montserrat-semi-bold text-lg hover:bg-[var(--color-navy)] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Password
          </motion.button>
          <p className="text-center text-sm text-[var(--color-charcoal)]">
            <button onClick={() => setView('login')} className="text-[var(--color-accent)] hover:underline font-montserrat-medium">Back to Sign in</button>
          </p>
        </form>
      );
    }
    return null;
  };

  const renderRightContent = () => (
    <div className="flex flex-col justify-center items-center text-center p-8">
      <img 
        src="https://images.unsplash.com/photo-1558618047-3c8c76ca7e87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
        alt="Exquisite Spices" 
        className="w-64 h-64 object-cover rounded-2xl mb-6 shadow-lg"
      />
      <h2 className="font-playfair-display-bold text-3xl text-[var(--color-text-dark)] mb-4">
        Elevate Your Kitchen
      </h2>
      <p className="font-montserrat-medium text-lg text-[var(--color-charcoal)] max-w-md">
        Discover premium organic spices that transform every meal into a masterpiece.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Subtle luxury background pattern on white */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(220,20,60,0.05),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(34,139,34,0.05),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(80,200,120,0.05),transparent_50%)]"></div>
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left: Form - Centered, no border, fixed height to avoid scroll */}
        <motion.div 
          className="w-full lg:w-1/2 bg-[var(--color-background)] rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center h-[600px]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="font-playfair-display-bold text-2xl text-[var(--color-text-dark)] mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {view === 'signup' ? 'Sign up' : view === 'login' ? 'Sign in' : view.replace(' ', ' ')}
          </motion.h1>

          <div className="w-full max-w-md">
            {renderForm()}
          </div>
        </motion.div>

        {/* Right: Image + Text - Adjusted for center */}
        <motion.div 
          className="w-full lg:w-1/2 flex justify-center"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {renderRightContent()}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClientAuth;