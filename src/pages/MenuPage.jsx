import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiPlus, FiStar, FiClock } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

const foodItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    price: 299,
    emoji: '🍕',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    category: 'Italian',
    rating: 4.5,
    time: '25 min',
    description: 'Classic cheese pizza with fresh basil',
  },
  {
    id: 2,
    name: 'Double Smash Burger',
    price: 199,
    emoji: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'American',
    rating: 4.8,
    time: '15 min',
    description: 'Juicy double patty with secret sauce',
  },
  {
    id: 3,
    name: 'Chocolate Ice Cream',
    price: 149,
    emoji: '🍦',
    image: 'https://images.unsplash.com/photo-1563589173312-476d8c36b3c9?w=400&h=300&fit=crop',
    category: 'Dessert',
    rating: 4.2,
    time: '5 min',
    description: 'Rich Belgian chocolate gelato',
  },
  {
    id: 4,
    name: 'Spicy Golgappa',
    price: 79,
    emoji: '🫙',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    category: 'Street Food',
    rating: 4.9,
    time: '10 min',
    description: 'Crispy puris with tangy water',
  },
  {
    id: 5,
    name: 'Papdi Chaat',
    price: 99,
    emoji: '🥘',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop',
    category: 'Street Food',
    rating: 4.6,
    time: '10 min',
    description: 'Crunchy papdi with yogurt & chutney',
  },
  {
    id: 6,
    name: 'Garden Salad',
    price: 129,
    emoji: '🥗',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    category: 'Healthy',
    rating: 3.8,
    time: '8 min',
    description: 'Fresh greens nobody actually orders',
  },
];

export default function MenuPage() {
  const { hellMode, addToCart, playSound, addToast } = useApp();
  const navigate = useNavigate();
  const [fakeLoading, setFakeLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [clickedCards, setClickedCards] = useState({});
  const [showFakeBtn, setShowFakeBtn] = useState(null);

  const categories = ['All', ...new Set(foodItems.map(item => item.category))];

  useEffect(() => {
    const timer = setTimeout(() => setFakeLoading(false), hellMode ? 3000 : 500);
    return () => clearTimeout(timer);
  }, [hellMode]);

  const handleFakeAddToCart = (item) => {
    playSound('error');
    setShowFakeBtn(item.id);
    addToast(hellMode
      ? "😂 That button is fake! Try clicking the image instead... if you can figure it out."
      : "Click the image to add to cart!",
      'error'
    );
    setTimeout(() => setShowFakeBtn(null), 2000);
  };

  const handleImageClick = (item) => {
    playSound('success');
    addToCart(item);
    setClickedCards(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setClickedCards(prev => ({ ...prev, [item.id]: false })), 600);
  };

  const filteredItems = activeCategory === 'All'
    ? foodItems
    : foodItems.filter(item => item.category === activeCategory);

  if (fakeLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="text-6xl mb-6"
        >
          {hellMode ? '💀' : '🍔'}
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="font-display text-xl text-gray-400"
        >
          {hellMode ? 'Loading... or is it? 🤔' : 'Loading delicious food...'}
        </motion.p>
        {hellMode && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-4"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative ${hellMode ? 'bg-noise' : ''}`}>
      {/* Background orbs */}
      <div className="orb w-96 h-96 bg-purple-600 -top-20 -left-40" />
      <div className="orb w-72 h-72 bg-rose-500 top-1/3 -right-20" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative z-10"
      >
        <h1
          className="font-display text-4xl sm:text-5xl font-black gradient-text mb-3"
          style={hellMode ? { fontSize: `${2 + Math.random() * 2}rem` } : {}}
        >
          {hellMode ? '🍕 Our "Menu" 🍕' : '🍽️ Our Menu'}
        </h1>
        <p
          className="text-gray-400 max-w-md mx-auto"
          style={hellMode ? {
            fontFamily: Math.random() > 0.5 ? 'Bangers' : 'Inter',
            transform: `rotate(${(Math.random() - 0.5) * 3}deg)`,
          } : {}}
        >
          {hellMode
            ? "Click 'Add to Cart' (hint: it won't work 😈). Try clicking the image instead!"
            : "Browse our delicious selection and add items to your cart"
          }
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3 mb-10 relative z-10"
      >
        {categories.map((cat, i) => (
          <motion.button
            key={cat}
            whileHover={{ scale: hellMode ? (Math.random() > 0.5 ? 1.2 : 0.8) : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveCategory(cat); playSound('click'); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white glow-purple'
                : 'glass text-gray-400 hover:text-white'
            }`}
            style={hellMode ? {
              fontSize: `${0.7 + Math.random() * 0.5}rem`,
              transform: `rotate(${(Math.random() - 0.5) * (i % 2 === 0 ? 5 : -5)}deg)`,
            } : {}}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 50, rotate: hellMode ? (Math.random() - 0.5) * 10 : 0 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: hellMode ? (Math.random() - 0.5) * 3 : 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={hellMode ? {
                rotate: (Math.random() - 0.5) * 5,
                scale: 1.02,
              } : { scale: 1.03, y: -5 }}
              className={`glass rounded-2xl overflow-hidden group ${
                clickedCards[item.id] ? 'animate-bounce-chaos' : ''
              }`}
              style={hellMode ? {
                marginTop: `${Math.random() * 30}px`,
              } : {}}
            >
              {/* Food Image - THIS is the real add to cart */}
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-violet-900/50', 'to-purple-900/50');
                    const emojiDiv = document.createElement('span');
                    emojiDiv.className = 'text-7xl';
                    emojiDiv.textContent = item.emoji;
                    e.target.parentElement.appendChild(emojiDiv);
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-semibold">
                    {hellMode ? '👆 Click me to ACTUALLY add!' : 'Click to add to cart'}
                  </span>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="glass px-3 py-1 rounded-full text-xs font-semibold text-purple-300">
                    {item.category}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 glass px-2 py-1 rounded-full">
                  <FiStar className="text-yellow-400 text-xs" />
                  <span className="text-xs font-semibold text-yellow-400">{item.rating}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className="font-display text-lg font-bold text-white"
                    style={hellMode ? {
                      fontSize: `${0.8 + Math.random() * 0.8}rem`,
                      fontFamily: ['Inter', 'Bangers', 'Outfit'][Math.floor(Math.random() * 3)],
                    } : {}}
                  >
                    {item.emoji} {item.name}
                  </h3>
                </div>

                <p className="text-gray-500 text-sm mb-3" style={hellMode ? {
                  textAlign: ['left', 'center', 'right'][Math.floor(Math.random() * 3)],
                } : {}}>
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-display text-xl font-black text-yellow-400 ${hellMode ? 'price-pulse' : ''}`}>
                      ₹{item.price}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <FiClock className="text-xs" /> {item.time}
                    </span>
                  </div>

                  {/* FAKE Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: hellMode ? 0.9 : 1.05 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleFakeAddToCart(item)}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 transition-all ${
                      showFakeBtn === item.id
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-shake'
                        : 'bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30'
                    }`}
                    style={hellMode ? {
                      transform: `rotate(${(Math.random() - 0.5) * 8}deg)`,
                    } : {}}
                  >
                    <FiPlus />
                    {showFakeBtn === item.id ? "LOL NOPE" : "Add to Cart"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Buy Now floating button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { navigate('/buy'); playSound('click'); }}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-display font-bold text-white shadow-2xl glow-purple flex items-center gap-2"
        >
          <FaFire className="text-yellow-400" />
          Buy Now
        </motion.button>
      </motion.div>
    </div>
  );
}
