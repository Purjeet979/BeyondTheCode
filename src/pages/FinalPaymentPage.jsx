import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FiCreditCard, FiCheck, FiCopy, FiRefreshCw } from 'react-icons/fi';
import { FaFire, FaSkull, FaCrown } from 'react-icons/fa';

const fakeCardErrors = [
  "Bhai kya kar raha hai tu? Card check kar! 💳",
  "Sahi khel gaya beta! Decline ho gaya 😂",
  "Tumse na ho payega beta! 🙅‍♂️",
  "Paisa khatam! Tata, bye-bye! 👋",
  "Ye toh tatti hai! Try another card 💩",
  "Abe saale! Paisa de pehle 😠",
  "Hindustani Bhau says: Nikal laude! 🚫",
  "Control Majnu Control! Card fail ✋",
];

const fakeCaptchas = [
  "Batao, 'B' ke baad kya aata hai? (Hint: C nahi hai)",
  "Type 'Hum sab pagal hain' backwards 🤪",
  "Kitni ungliyan hain? Batao face pe 🖐️",
  "Zindagi ka kya matlab hai? Answer 69 accepted.",
  "Prove you're human by saying 'Mei ek idiot hun' 😭",
];

export default function FinalPaymentPage() {
  const { hellMode, clearCart, cart, cartTotal, playSound, addToast } = useApp();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('form'); // form, processing, captcha, success, troll
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentCaptcha, setCurrentCaptcha] = useState('');
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [volume, setVolume] = useState(42);

  const totalWithTax = hellMode ? cartTotal + Math.round(cartTotal * 0.15) + 69 : cartTotal;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/menu');
    }
  }, []);

  // Hell mode: move the pay button randomly on hover
  useEffect(() => {
    if (!hellMode) return;
    const handleMouseMove = () => {
      if (Math.random() > 0.8) {
        setCursorOffset({
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 60,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hellMode]);

  const formatCard = (val) => {
    const cleaned = val.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : '';
  };

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handlePay = () => {
    if (!cardNumber || !cvv || !expiry) {
      addToast("Fill in all fields! Even fake ones! 😤", 'error');
      playSound('error');
      return;
    }

    playSound('click');
    setPhase('processing');

    if (hellMode) {
      // In hell mode: first few attempts fail with funny errors
      if (attempts < 2) {
        setTimeout(() => {
          const error = fakeCardErrors[Math.floor(Math.random() * fakeCardErrors.length)];
          addToast(error, 'error');
          playSound('evil');
          setAttempts(prev => prev + 1);
          setPhase('form');
        }, 2000 + Math.random() * 2000);
      } else if (attempts === 2) {
        // Third attempt: show captcha
        setTimeout(() => {
          setCurrentCaptcha(fakeCaptchas[Math.floor(Math.random() * fakeCaptchas.length)]);
          setPhase('captcha');
          setAttempts(prev => prev + 1);
        }, 2000);
      } else {
        // After captcha: show "success" then troll
        setTimeout(() => {
          setPhase('success');
          playSound('success');
          setShowConfetti(true);

          setTimeout(() => {
            setPhase('troll');
            playSound('evil');
          }, 3000);
        }, 3000);
      }
    } else {
      // Normal mode: just succeed
      setTimeout(() => {
        setPhase('success');
        playSound('success');
        setShowConfetti(true);
        clearCart();
      }, 1500);
    }
  };

  const handleCaptchaSubmit = () => {
    playSound('click');
    addToast("Captcha accepted! (We didn't actually check) 🤫", 'success');
    setPhase('form');
  };

  const handleTrollRestart = () => {
    playSound('evil');
    clearCart();
    addToast("Thanks for the experience! Your food was never real 💀", 'sarcastic');
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto relative ${hellMode ? 'bg-noise' : ''}`}>
      {/* Background */}
      <div className="orb w-96 h-96 bg-emerald-600 -top-20 -left-40" />
      <div className="orb w-72 h-72 bg-violet-600 bottom-20 -right-20" />

      {/* Confetti */}
      {showConfetti && Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="confetti"
          initial={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            scale: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [0, 1, 0],
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
          style={{ fontSize: '24px' }}
        >
          {['🎉', '🎊', '✨', '🌟', '🔥', '💀'][Math.floor(Math.random() * 6)]}
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        {/* FORM PHASE */}
        {phase === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="relative z-10"
          >
            <div className="text-center mb-10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl mb-4"
              >
                💳
              </motion.div>
              <h1 className="font-display text-4xl sm:text-5xl font-black gradient-text mb-3">
                {hellMode ? 'Payment "Portal" 💸' : 'Complete Payment'}
              </h1>
              <p className="text-gray-400">
                {hellMode
                  ? `Attempt #${attempts + 1} — ${attempts > 0 ? "Let's see if it works THIS time 🤞" : "Good luck with this one 😈"}`
                  : "Enter your payment details to complete your order"
                }
              </p>
            </div>

            {/* Order Summary */}
            <div className="glass rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Order Total</span>
                <motion.span
                  animate={hellMode ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="font-display text-2xl font-black text-yellow-400"
                >
                  ₹{totalWithTax}
                </motion.span>
              </div>
              {hellMode && (
                <p className="text-xs text-gray-500 text-center">
                  (includes Chaos Tax, Convenience Fee, and our profit margin of "yes")
                </p>
              )}
            </div>

            {/* Card Form */}
            <div className="glass-strong rounded-2xl p-6 space-y-5">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Card Number {hellMode && <span className="text-gray-500">(any 16 digits, we don't care)</span>}
                </label>
                <div className="relative">
                  <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    maxLength={19}
                    placeholder={hellMode ? "1234 5678 9012 3456" : "•••• •••• •••• ••••"}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-mono"
                    style={hellMode ? {
                      direction: Math.random() > 0.7 ? 'rtl' : 'ltr',
                    } : {}}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Expiry {hellMode && <span className="text-gray-500">(past dates ok 😂)</span>}
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-mono"
                    style={hellMode && attempts > 0 ? { transform: `rotate(${(Math.random() - 0.5) * 5}deg)` } : {}}
                  />
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    CVV {hellMode && <span className="text-gray-500">(123 works)</span>}
                  </label>
                  <input
                    type={hellMode ? "text" : "password"}
                    maxLength={3}
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-mono"
                  />
                </div>
              </div>

              {hellMode && (
                <div className="glass rounded-xl p-4 bg-red-500/5">
                  <label className="block text-xs font-bold text-red-400 mb-2 uppercase tracking-widest">
                    Verification Volume (Must be exactly 69%)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        // Make it jump
                        if (Math.random() > 0.6) {
                          setVolume(Math.min(100, Math.max(0, val + (Math.random() > 0.5 ? 5 : -5))));
                        } else {
                          setVolume(val);
                        }
                      }}
                      className="flex-1 accent-red-500"
                    />
                    <span className="font-mono text-xl text-yellow-400 w-12">{volume}%</span>
                  </div>
                  {volume === 69 ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-green-400 mt-1">
                      Perfect score! Or is it? 😈
                    </motion.p>
                  ) : (
                    <p className="text-[10px] text-gray-500 mt-1">Keep sliding... its almost there...</p>
                  )}
                </div>
              )}

              {/* Pay Button */}
              <motion.button
                whileHover={{ scale: hellMode ? 0.95 : 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (hellMode && volume !== 69) {
                    addToast("Volume must be EXACTLY 69% to verify your human soul! 😤", 'error');
                    playSound('error');
                    return;
                  }
                  handlePay();
                }}
                animate={hellMode ? { x: cursorOffset.x, y: cursorOffset.y } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className={`w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-display font-bold text-lg text-white glow-purple flex items-center justify-center gap-2 ${hellMode && volume !== 69 ? 'opacity-50 grayscale' : ''}`}
              >
                <FaCrown className="text-yellow-400" />
                {hellMode ? `Pay ₹${totalWithTax} (Attempt #${attempts + 1})` : `Pay ₹${totalWithTax}`}
              </motion.button>

              {hellMode && attempts > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-center text-gray-500"
                >
                  Failed attempts: {attempts} | Success rate: 0% | Your patience: remarkable
                </motion.p>
              )}
            </div>

            {/* Security badge (ironic) */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-center mt-6 text-gray-500 text-xs flex items-center justify-center gap-2"
            >
              🔒 {hellMode ? '"Secured" by TrustMeBro™ Encryption' : 'Secured with 256-bit encryption'}
            </motion.div>
          </motion.div>
        )}

        {/* PROCESSING PHASE */}
        {phase === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="text-7xl mb-6 inline-block"
            >
              {hellMode ? '💀' : '💳'}
            </motion.div>

            <h2 className="font-display text-2xl font-bold text-gray-300 mb-3">
              {hellMode ? 'Processing... maybe... 🤔' : 'Processing payment...'}
            </h2>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: hellMode ? 4 : 1.5, ease: 'easeInOut' }}
              className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mx-auto"
            />

            {hellMode && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-gray-500 mt-4"
              >
                Contacting your bank... they put us on hold 📞
              </motion.p>
            )}
          </motion.div>
        )}

        {/* CAPTCHA PHASE */}
        {phase === 'captcha' && (
          <motion.div
            key="captcha"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🤖</div>
              <h1 className="font-display text-3xl font-black gradient-text mb-3">
                Are You Human?
              </h1>
              <p className="text-gray-400">
                Our state-of-the-art AI needs to verify you're not a toaster
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-6 space-y-4">
              <p className="text-gray-300 font-semibold text-center text-lg">
                {currentCaptcha}
              </p>

              <input
                type="text"
                placeholder="Your answer..."
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCaptchaSubmit}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-display font-bold text-white"
              >
                Verify I'm Human (or am I?) 🧐
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* SUCCESS PHASE */}
        {phase === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="relative z-10 text-center py-20"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 360] }}
              transition={{ duration: 1.5 }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>

            <h1 className="font-display text-4xl font-black text-green-400 mb-4">
              Payment Successful!
            </h1>

            <p className="text-gray-400 text-lg mb-2">
              {hellMode
                ? "Wait for it... 😏"
                : "Your order has been placed successfully!"
              }
            </p>

            {!hellMode && (
              <div className="glass-strong rounded-2xl p-6 max-w-sm mx-auto mt-6">
                <p className="text-gray-300 text-sm mb-3">Order ID: #UXH{Math.floor(Math.random() * 99999)}</p>
                <p className="text-gray-400 text-xs">Estimated delivery: 30-45 minutes</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold text-white text-sm"
                >
                  Back to Home
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* TROLL PHASE (Hell Mode Only) */}
        {phase === 'troll' && (
          <motion.div
            key="troll"
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            className="relative z-10 text-center py-16"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1 }}
              className="text-8xl mb-6"
            >
              💀
            </motion.div>

            <h1 className="font-display text-4xl font-black text-red-400 mb-4">
              SIKE! ORDER CANCELLED! 😈
            </h1>

            <div className="glass-strong rounded-2xl p-6 max-w-md mx-auto mb-6">
              <p className="text-gray-300 mb-4">
                Just kidding about the payment. Your money is safe (we never had it). 
                This whole website was a terrible UX experience by design! 🎨
              </p>

              <div className="space-y-2 text-sm text-gray-400">
                <p>✅ Fake payment buttons that dodge you</p>
                <p>✅ Add to cart buttons that don't work</p>
                <p>✅ Random popups and rickrolls</p>
                <p>✅ Quiz to "verify" payment</p>
                <p>✅ Cart gets cleared on wrong answer</p>
                <p>✅ Chaos tax and fake fees</p>
              </div>
            </div>

            <p className="text-xl text-purple-400 font-display font-bold mb-6">
              Welcome to LapLapat — Jahan design nahi, dard milta hai! 🔥
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTrollRestart}
                className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-display font-bold text-white glow-purple"
              >
                Play Again? 🔁
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  addToast("LapLapat se bachne ke liye badhai! 🏆", 'success');
                  playSound('success');
                }}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-display font-bold text-black"
              >
                I Survived LapLapat 🏆
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
