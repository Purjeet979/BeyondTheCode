import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FiClock, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import { FaFire, FaSkull, FaBrain } from 'react-icons/fa';

export default function PaymentPage() {
  const { hellMode, clearCart, getRandomQuestion, playSound, addToast, cart, cartTotal } = useApp();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(30);
  const [phase, setPhase] = useState('intro'); // intro, quiz, result
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/menu');
      return;
    }
    setQuestion(getRandomQuestion());
  }, []);

  useEffect(() => {
    if (phase !== 'quiz') return;

    if (timer <= 0) {
      handleTimeout();
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, phase]);

  const handleTimeout = () => {
    playSound('evil');
    setIsCorrect(false);
    setPhase('result');

    if (hellMode) {
      setTimeout(() => {
        clearCart();
        addToast("⏰ TIME'S UP! Cart cleared. Back to the start, genius! 💀", 'error');
        setTimeout(() => navigate('/'), 2500);
      }, 2000);
    }
  };

  const handleAnswer = (index) => {
    if (selected !== null) return;

    setSelected(index);
    playSound('click');

    const correct = index === question.answer;
    setIsCorrect(correct);
    setPhase('result');

    if (correct) {
      playSound('success');
      addToast("🎉 Correct! You actually know stuff!", 'success');
      setTimeout(() => navigate('/final-payment'), 2000);
    } else {
      playSound('evil');
      if (hellMode) {
        setTimeout(() => {
          clearCart();
          addToast("❌ WRONG! Cart cleared. Restart from the beginning, dumbo! 🤡", 'error');
          setTimeout(() => {
            alert(hellMode
              ? "😂 Wrong answer! Your cart has been yeeted into the void. Thanks for playing UX Hell! 💀"
              : "Incorrect answer. Please try again."
            );
            navigate('/');
          }, 1500);
        }, 1500);
      } else {
        setTimeout(() => {
          setQuestion(getRandomQuestion());
          setSelected(null);
          setIsCorrect(null);
          setTimer(30);
          setPhase('intro');
        }, 2000);
      }
    }
  };

  const startQuiz = () => {
    setPhase('quiz');
    setTimer(30);
    playSound('click');
  };

  const timerColor = timer > 20 ? 'text-green-400' : timer > 10 ? 'text-yellow-400' : 'text-red-400';
  const timerBg = timer > 20 ? 'from-green-500' : timer > 10 ? 'from-yellow-500' : 'from-red-500';

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto relative ${hellMode ? 'bg-noise' : ''}`}>
      {/* Background */}
      <div className="orb w-96 h-96 bg-cyan-600 -top-20 -left-40" />
      <div className="orb w-72 h-72 bg-purple-600 bottom-20 -right-20" />

      {/* Intro Phase */}
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 text-center"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-7xl mb-6"
            >
              🧠
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl font-black gradient-text mb-4">
              {hellMode ? 'Payment Security Check™' : 'Quick Verification'}
            </h1>

            <div className="glass-strong rounded-2xl p-6 mb-6">
              <p className="text-gray-300 mb-4">
                {hellMode
                  ? "Before we take your money, prove you're smart enough to order food. Answer a GK question within 30 seconds!"
                  : "Please answer a quick verification question to proceed with payment."
                }
              </p>

              {hellMode && (
                <div className="glass rounded-xl p-4 mb-4 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <FiAlertTriangle /> <span className="font-bold text-sm">⚠️ WARNING</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Wrong answer = Cart cleared + Back to start. No pressure! 😈
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><FiClock /> 30 seconds</span>
                <span>•</span>
                <span className="flex items-center gap-1"><FaBrain /> 1 question</span>
                <span>•</span>
                <span className="flex items-center gap-1"><FaFire /> {hellMode ? 'No mercy' : 'Easy'}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startQuiz}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-display font-bold text-lg text-white glow-purple"
            >
              {hellMode ? "I'm Ready (I think) 😰" : "Start Verification"}
            </motion.button>
          </motion.div>
        )}

        {/* Quiz Phase */}
        {phase === 'quiz' && question && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10"
          >
            {/* Timer */}
            <div className="text-center mb-8">
              <motion.div
                animate={timer <= 10 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-strong ${timerColor} font-display text-3xl font-black`}
              >
                <FiClock className={timer <= 5 ? 'animate-spin' : ''} />
                {timer}s
              </motion.div>

              {/* Timer bar */}
              <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timer / 30) * 100}%` }}
                  className={`h-full bg-gradient-to-r ${timerBg} to-transparent rounded-full`}
                />
              </div>
            </div>

            {/* Question */}
            <div className="glass-strong rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white text-center mb-2">
                {question.q}
              </h2>
              {hellMode && (
                <p className="text-center text-xs text-gray-500 mt-1">
                  (no googling allowed... we're watching 👀)
                </p>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={selected === null ? { scale: 1.03 } : {}}
                  whileTap={selected === null ? { scale: 0.97 } : {}}
                  onClick={() => handleAnswer(index)}
                  disabled={selected !== null}
                  className={`p-4 rounded-xl font-semibold text-left transition-all border ${
                    selected === null
                      ? 'glass border-white/10 hover:border-purple-500/50 text-gray-200'
                      : selected === index
                        ? index === question.answer
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'bg-red-500/20 border-red-500/50 text-red-400'
                        : index === question.answer && selected !== null
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'glass border-white/5 text-gray-500'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                    {selected !== null && index === question.answer && (
                      <FiCheck className="ml-auto text-green-400" />
                    )}
                    {selected === index && index !== question.answer && (
                      <FiX className="ml-auto text-red-400" />
                    )}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Result Phase */}
        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center py-12"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: isCorrect ? [0, 360] : [0, -10, 10, -10, 0] }}
              transition={{ duration: 1 }}
              className="text-8xl mb-6"
            >
              {isCorrect ? '🎉' : '💀'}
            </motion.div>

            <h2 className="font-display text-3xl font-black mb-4">
              {isCorrect ? (
                <span className="text-green-400">CORRECT! 🎊</span>
              ) : (
                <span className="text-red-400">
                  {timer <= 0 ? "TIME'S UP! ⏰" : "WRONG! 😂"}
                </span>
              )}
            </h2>

            <p className="text-gray-400 text-lg">
              {isCorrect
                ? "Proceeding to payment..."
                : hellMode
                  ? "Your cart is being deleted. Redirecting to start... 💀"
                  : "Try again with a new question..."
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
