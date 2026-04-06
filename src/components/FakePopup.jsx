import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FiX } from 'react-icons/fi';

const popupMessages = [
  { title: "🎉 Congratulations!", text: "You've been selected to win absolutely nothing!", btn: "Claim Nothing" },
  { title: "⚠️ WARNING!", text: "Your device has 69 viruses!!! Click to fix (not really)", btn: "Fix Now" },
  { title: "💰 SPECIAL OFFER!", text: "Buy 1 get 0 free! Limited time only!", btn: "What a Deal" },
  { title: "🍕 FUN FACT!", text: "You've scrolled enough to burn 0.003 calories!", btn: "Worth It" },
  { title: "🤖 SYSTEM UPDATE!", text: "Updating your taste in food... please wait.", btn: "I Can't Stop This" },
  { title: "👀 WE SEE YOU!", text: "Yes, we know you're hungry. Stop pretending.", btn: "Fine..." },
  { title: "📢 BREAKING NEWS!", text: "Scientists confirm: You WILL order pizza again.", btn: "They're Right" },
  { title: "🎵 NOTIFICATION!", text: "Your food is NOT on the way. You haven't ordered yet.", btn: "Oh Right" },
];

export default function FakePopup() {
  const { hellMode } = useApp();
  const [popup, setPopup] = useState(null);
  const [position, setPosition] = useState({ top: '30%', left: '30%' });

  useEffect(() => {
    if (!hellMode) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const randomPopup = popupMessages[Math.floor(Math.random() * popupMessages.length)];
        setPosition({
          top: `${10 + Math.random() * 60}%`,
          left: `${10 + Math.random() * 60}%`,
        });
        setPopup(randomPopup);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [hellMode]);

  if (!hellMode) return null;

  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0, rotate: 15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 200 }}
          className="w-80 glass-strong rounded-2xl p-5 border border-yellow-500/30 shadow-2xl"
        >
          <button
            onClick={() => setPopup(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            <FiX />
          </button>

          <h3 className="font-display text-lg font-bold text-yellow-400 mb-2">{popup.title}</h3>
          <p className="text-gray-300 text-sm mb-4">{popup.text}</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPopup(null)}
            className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold text-sm text-black"
          >
            {popup.btn}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
