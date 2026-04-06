import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FaFire, FaSkull, FaCrown } from 'react-icons/fa';
import { FiDollarSign, FiLogOut, FiZap } from 'react-icons/fi';

export default function LandingPage() {
  const navigate = useNavigate();
  const { hellMode, setHasPaid, playSound, playMeme } = useApp();
  const [exitPos, setExitPos] = useState({ x: 0, y: 0 });
  const [exitScale, setExitScale] = useState(1);
  const [exitAttempts, setExitAttempts] = useState(0);
  const [showPayAnimation, setShowPayAnimation] = useState(false);
  const [showInsult, setShowInsult] = useState('');
  const containerRef = useRef(null);

  const exitInsults = [
    "Pehli fursat mein nikal! 🚶‍♂️",
    "Bhai kya kar raha hai tu? 🤦‍♂️",
    "Arre kehna kya chahte ho? 🤔",
    "Maaro mujhe maaro! 😭",
    "Gajab beizzati hai! 🤡",
    "Nikal laude (Pehli fursat mein) 🚫",
    "Tumse na ho payega beta! 🙅‍♂️",
    "Kya bolti public? Nikalna hai kya? 💀",
    "Chhoti bachi ho kya? 👧",
    "Aap Mumbai aa sakte hain... nikalne ke liye! 😂",
  ];

  const moveExitButton = useCallback(() => {
    if (!hellMode) return;
    
    // Roam the ENTIRE viewport
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 50;
    
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setExitPos({ x: newX, y: newY });
    // Keep it readable - min scale 0.7
    setExitScale(prev => Math.max(prev * 0.98, 0.7));
    setExitAttempts(prev => prev + 1);
    
    const memes = ['nikal', 'saale', 'bhai', 'beizzati'];
    playMeme(memes[Math.floor(Math.random() * memes.length)]);

    const insult = exitInsults[Math.floor(Math.random() * exitInsults.length)];
    setShowInsult(insult);
    setTimeout(() => setShowInsult(''), 2000);
  }, [hellMode, playMeme]);

  const handlePay = () => {
    playSound('pay');
    setShowPayAnimation(true);
    setTimeout(() => {
      setHasPaid(true);
      navigate('/menu');
    }, 1500);
  };

  const handleExit = () => {
    if (hellMode) {
      moveExitButton();
    } else {
      window.close();
    }
  };

  return (
    <div ref={containerRef} className={`min-h-screen flex items-center justify-center relative overflow-hidden ${hellMode ? 'cursed-cursor' : ''}`}>
      {/* Background orbs */}
      <div className="orb w-96 h-96 bg-purple-600 top-10 -left-20" />
      <div className="orb w-80 h-80 bg-rose-600 bottom-10 right-10" />
      <div className="orb w-64 h-64 bg-cyan-600 top-1/2 left-1/2" />

      {/* Floating particles */}
      {hellMode && Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * -500],
            x: [null, (Math.random() - 0.5) * 200],
            rotate: [0, 360],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeOut',
          }}
        >
          {['🔥', '💀', '😈', '👻', '🦇'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}

      {/* Main Card - INCREASED SIZE to fill screen more */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-10 max-w-4xl w-full mx-4"
      >
        <div className="gradient-border">
          <div className="glass-strong rounded-2xl p-8 sm:p-12">
            {/* Logo */}
            <motion.div
              animate={hellMode ? { rotate: [0, -5, 5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="inline-block text-8xl mb-6"
              >
                {hellMode ? '😈' : '🍔'}
              </motion.div>

              <h1 className="font-display text-6xl sm:text-8xl font-black gradient-text mb-3 animate-pulse">
                LapLapat
              </h1>

              <p className="text-gray-400 text-lg sm:text-xl font-semibold">
                {hellMode
                  ? "Bilkul riks nahi lene ka! (Lekin hum toh lenge) 😈"
                  : "Welcome! Aaiye, LapLapat par kuch aag lagayi jaye 🔥"
                }
              </p>
            </motion.div>

            {/* Pay to enter message */}
            <motion.div
              animate={hellMode ? { scale: [1, 1.02, 1] } : {}}
              transition={{ repeat: Infinity, duration: 3 }}
              className="glass rounded-2xl p-8 mb-10 text-center border-white/10"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <FiDollarSign className="text-yellow-400 text-3xl" />
                <span className="font-display text-2xl font-bold text-yellow-400">
                  {hellMode ? 'Pay $1 to use this website' : 'Welcome! Enter for free'}
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                {hellMode
                  ? "Yes, we're serious. (Not really, but click Pay anyway)"
                  : "Click enter to browse our delicious menu"
                }
              </p>
            </motion.div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center relative min-h-[100px]">
              {/* Pay / Enter Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePay}
                className="relative w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-display font-bold text-xl text-white glow-purple overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {hellMode ? <FaCrown /> : <FiZap />}
                  {hellMode ? 'Pay $1 💸' : 'Enter'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              {/* Exit Button - FIXED POSITION when in Hell Mode to roam whole screen */}
              {hellMode ? (
                <motion.button
                  key="exit-hell"
                  initial={false}
                  animate={{ left: exitPos.x, top: exitPos.y, scale: exitScale }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  onClick={handleExit}
                  onMouseEnter={moveExitButton}
                  className="fixed z-[200] px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl font-display font-bold text-lg text-gray-300 border border-gray-600"
                >
                  <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                    <FiLogOut />
                    Exit
                  </span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleExit}
                  className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl font-display font-bold text-xl text-gray-300 border border-gray-600"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiLogOut />
                    Exit
                  </span>
                </motion.button>
              )}
            </div>

            {/* Exit attempts counter */}
            {hellMode && exitAttempts > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-4"
              >
                <span className="text-xs text-gray-500">
                  Exit attempts: {exitAttempts} | Button size: {Math.round(exitScale * 100)}%
                </span>
              </motion.div>
            )}

            {/* Insult message */}
            <AnimatePresence>
              {showInsult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute -bottom-16 left-0 right-0 text-center"
                >
                  <span className="text-sm text-red-400 font-semibold glass px-4 py-2 rounded-full">
                    {showInsult}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Evil mode indicator */}
        {hellMode && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-center mt-6 flex items-center justify-center gap-2 text-red-400 text-sm"
          >
            <FaFire /> Chaos Mode Active <FaFire />
          </motion.div>
        )}
      </motion.div>

      {/* Pay Animation Overlay */}
      <AnimatePresence>
        {showPayAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <div className="text-8xl mb-4">💸</div>
              <h2 className="font-display text-3xl font-bold gradient-text">
                {hellMode ? "Thanks for your $1, sucker!" : "Welcome!"}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
