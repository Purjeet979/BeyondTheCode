import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

export default function BuyNowPage() {
  const { cart, removeFromCart, addToCart, clearCart, cartTotal, cartCount, hellMode, playSound, addToast } = useApp();
  const navigate = useNavigate();
  const [delayedProceed, setDelayedProceed] = useState(false);

  const handleProceed = () => {
    if (cart.length === 0) {
      addToast("Your cart is empty! Go add some food first 🍕", 'error');
      playSound('error');
      return;
    }

    playSound('click');

    if (hellMode) {
      setDelayedProceed(true);
      addToast("Processing... please wait... ⏳", 'info');

      // Intentional delay in hell mode
      setTimeout(() => {
        addToast("Still processing... 🐌", 'info');
      }, 1500);

      setTimeout(() => {
        addToast("Almost there... maybe... 🤔", 'info');
      }, 3000);

      setTimeout(() => {
        setDelayedProceed(false);
        navigate('/payment');
      }, 4500);
    } else {
      navigate('/payment');
    }
  };

  const handleRemove = (itemId) => {
    playSound('click');
    removeFromCart(itemId);
    if (hellMode) {
      addToast("Removed! Your food is crying 😢", 'sarcastic');
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative ${hellMode ? 'bg-noise' : ''}`}>
      {/* Background */}
      <div className="orb w-96 h-96 bg-violet-600 -top-20 -right-40" />
      <div className="orb w-64 h-64 bg-rose-500 bottom-20 -left-20" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 relative z-10"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-black gradient-text mb-3">
          {hellMode ? '🛒 Your "Cart" 🛒' : '🛒 Your Cart'}
        </h1>
        <p className="text-gray-400">
          {hellMode
            ? "Surprised you made it here without getting Rickrolled? 😏"
            : "Review your order before proceeding"
          }
        </p>
      </motion.div>

      {cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 relative z-10"
        >
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="font-display text-2xl font-bold text-gray-400 mb-4">
            {hellMode ? "Empty cart? Pathetic." : "Your cart is empty"}
          </h2>
          <p className="text-gray-500 mb-8">
            {hellMode ? "Go back and click on the IMAGES (not the buttons 😈)" : "Browse our menu to add items"}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/menu')}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-display font-bold text-white glow-purple"
          >
            Browse Menu
          </motion.button>
        </motion.div>
      ) : (
        <div className="relative z-10 space-y-6">
          {/* Cart Items */}
          <AnimatePresence>
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: hellMode ? (index % 2 === 0 ? -100 : 100) : 0, y: 30 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: hellMode ? (Math.random() - 0.5) * 3 : 0,
                }}
                exit={{ opacity: 0, x: -200, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4"
                style={hellMode ? { marginLeft: `${Math.random() * 40}px` } : {}}
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-violet-900/30');
                      const emojiDiv = document.createElement('span');
                      emojiDiv.className = 'text-4xl';
                      emojiDiv.textContent = item.emoji;
                      e.target.parentElement.appendChild(emojiDiv);
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-display text-lg font-bold text-white">
                    {item.emoji} {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (item.qty <= 1) handleRemove(item.id);
                      else removeFromCart(item.id);
                    }}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                  >
                    <FiMinus className="text-sm" />
                  </motion.button>
                  <span className="font-bold text-lg w-8 text-center">{item.qty}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { addToCart(item); }}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-green-500/20 transition-colors"
                  >
                    <FiPlus className="text-sm" />
                  </motion.button>
                </div>

                {/* Price */}
                <span className="font-display text-xl font-black text-yellow-400">
                  ₹{item.price * item.qty}
                </span>

                {/* Remove */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <FiTrash2 />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-strong rounded-2xl p-6 mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Items</span>
              <span className="font-semibold">{cartCount}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Subtotal</span>
              <span className="font-semibold">₹{cartTotal}</span>
            </div>

            {hellMode && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Chaos Tax 😈</span>
                  <span className="font-semibold text-red-400">₹{Math.round(cartTotal * 0.15)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Convenience Fee</span>
                  <span className="font-semibold text-red-400">₹69</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 line-through">Discount</span>
                  <span className="font-semibold text-green-400 line-through">-₹0 (lol)</span>
                </div>
              </>
            )}

            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="font-display text-xl font-bold">Total</span>
              <motion.span
                animate={hellMode ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className="font-display text-2xl font-black text-yellow-400"
              >
                ₹{hellMode ? cartTotal + Math.round(cartTotal * 0.15) + 69 : cartTotal}
              </motion.span>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { clearCart(); playSound('error'); addToast("Cart cleared! Starting from scratch 😭", 'error'); }}
                className="flex-1 py-3 rounded-xl font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
              >
                Clear Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceed}
                disabled={delayedProceed}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-display font-bold text-white glow-purple flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {delayedProceed ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    ⏳
                  </motion.span>
                ) : (
                  <>
                    Proceed to Pay <FiArrowRight />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
