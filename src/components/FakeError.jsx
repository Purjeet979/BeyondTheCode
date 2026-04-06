import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertTriangle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const errorMessages = [
  "Bhai, tera system phatne wala hai! 💣",
  "Error: User competence not found. 🚫",
  "Warning: Too much swag detected. 😎",
  "System Failure: Maaro mujhe maaro! 😭",
  "Nikal Laude! (System is tired of you) 🚶‍♂️",
  "Abe saale! Window close mat kar. 😠",
  "Gajab beizzati hai yaar! 🤡",
  "Paisa hi paisa hoga! (Leke dikha beta) 💸",
];

export default function FakeError() {
  const { hellMode, playMeme } = useApp();
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!hellMode) {
      setErrors([]);
      return;
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newError = {
          id: Date.now(),
          x: Math.random() * (window.innerWidth - 300),
          y: Math.random() * (window.innerHeight - 200),
          msg: errorMessages[Math.floor(Math.random() * errorMessages.length)],
        };
        setErrors(prev => [...prev, newError]);
        playMeme('bhai');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hellMode, playMeme]);

  const removeError = (id) => {
    setErrors(prev => prev.filter(e => e.id !== id));
    playMeme('nikal');
  };

  if (!hellMode) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[300]">
      <AnimatePresence>
        {errors.map((err) => (
          <motion.div
            key={err.id}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            style={{ left: err.x, top: err.y }}
            className="absolute w-72 bg-[#D4D0C8] border-2 border-white border-r-gray-600 border-b-gray-600 p-1 pointer-events-auto shadow-2xl"
          >
            {/* Windows 95 style header */}
            <div className="bg-[#000080] text-white flex items-center justify-between px-1 py-0.5">
              <div className="flex items-center gap-1">
                <FiAlertTriangle className="text-yellow-400 text-xs" />
                <span className="text-[10px] font-bold font-sans tracking-tight">System Message</span>
              </div>
              <button 
                onClick={() => removeError(err.id)}
                className="w-4 h-4 bg-[#D4D0C8] border border-gray-600 flex items-center justify-center text-black"
              >
                <FiX className="text-[10px]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl">
                !
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-sans text-black leading-tight">
                  {err.msg}
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button 
                    onClick={() => removeError(err.id)}
                    className="px-4 py-1 bg-[#D4D0C8] border-2 border-white border-r-gray-600 border-b-gray-600 text-[11px] text-black active:border-gray-600 active:border-r-white active:border-b-white"
                  >
                    Thik Hai
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
