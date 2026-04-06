import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FiShoppingCart, FiMenu, FiX, FiZap } from 'react-icons/fi';
import { FaFire, FaSkull } from 'react-icons/fa';

export default function Navbar() {
  const { hellMode, toggleMode, cartCount, setShowRickroll, playSound, hasPaid } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartShake, setCartShake] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartCount > 0) {
      setCartShake(true);
      setTimeout(() => setCartShake(false), 500);
    }
  }, [cartCount]);

  const handleCartClick = () => {
    playSound('click');
    if (hellMode) {
      setShowRickroll(true);
      playSound('evil');
    } else {
      navigate('/buy');
    }
  };

  if (!hasPaid && location.pathname === '/') return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/menu" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="text-2xl"
            >
              {hellMode ? '😈' : '😇'}
            </motion.div>
            <span className="font-display text-xl font-bold gradient-text">
              LapLapat
            </span>
            {hellMode && (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30"
              >
                HELL MODE
              </motion.span>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/menu" label="Menu" hellMode={hellMode} />
            <NavLink to="/buy" label="Buy Now" hellMode={hellMode} />

            {/* Cart Button */}
            <motion.button
              onClick={handleCartClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative p-2 rounded-xl ${hellMode ? 'bg-purple-500/20 hover:bg-purple-500/30' : 'bg-violet-500/20 hover:bg-violet-500/30'} transition-colors`}
            >
              <FiShoppingCart className={`text-xl ${cartShake ? 'animate-shake' : ''}`} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mode Toggle */}
            <motion.button
              onClick={() => { toggleMode(); playSound('click'); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                hellMode
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white glow-red'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              }`}
            >
              {hellMode ? <FaSkull /> : <FiZap />}
              {hellMode ? 'Hell Mode' : 'Normal Mode'}
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              <Link to="/menu" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">Menu</Link>
              <Link to="/buy" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">Buy Now</Link>
              <button onClick={handleCartClick} className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                <FiShoppingCart /> Cart ({cartCount})
              </button>
              <button
                onClick={() => { toggleMode(); playSound('click'); }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm ${
                  hellMode ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}
              >
                {hellMode ? <FaSkull /> : <FiZap />}
                {hellMode ? 'Hell Mode ON' : 'Normal Mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ to, label, hellMode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.span
        whileHover={{ scale: hellMode ? 0.8 : 1.05 }}
        className={`text-sm font-medium transition-colors ${
          isActive
            ? 'text-violet-400'
            : 'text-gray-400 hover:text-gray-200'
        }`}
        style={hellMode ? { fontFamily: Math.random() > 0.5 ? 'Bangers' : 'Inter' } : {}}
      >
        {label}
      </motion.span>
    </Link>
  );
}
