import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { FaGhost } from 'react-icons/fa';

const chatInsults = [
  "Abey! Sun... main thujhe judge karne aaya hun. 😈",
  "Oye! Kya chahiye thujhe? Nikal yahan se. 😈",
  "Main tera dost nahi hoon, samajh gaya? 😈",
  "Bhai, thoda dimaag laga le. 🧠",
  "Error: User competence not found (dimag hai kya?). 🚫",
  "Paisa hi paisa hoga! (Lekar toh dikha) 💸",
  "Chhoti bachi ho kya? 👧",
  "Tumसे na ho payega beta! 🙅‍♂️",
  "Zindagi barbaad ho gaya! 🚮",
  "Nikar laude pehla fursat mein. 🚫",
];

const botResponses = [
  "Main tera dost nahi hoon, samajh gaya? 😠",
  "Nahi deni help, ja! 🙅‍♂️",
  "Mujhe mat sikha! 🤫",
  "Arre kehna kya chahte ho? 🤨",
  "Gajab beizzati hai yaar! 🤡",
  "Mera time kharab mat kar, nikal yahan se! 🏃",
];

export default function SupportChat() {
  const { hellMode, playSound } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Abey! Sun... main thujhe judge karne aaya hun. 😈", isBot: true },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [shake, setShake] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!hellMode) {
      setIsOpen(false);
      return;
    }

    const interval = setInterval(() => {
      if (!isOpen && Math.random() > 0.7) {
        setIsOpen(true);
        playSound('click');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [hellMode, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    playSound('click');
    setMessages(prev => [...prev, { text: inputValue, isBot: false }]);
    const userMsg = inputValue.toLowerCase();
    setInputValue('');

    setTimeout(() => {
      playSound('error');
      const response = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    }, 1000);
  };

  if (!hellMode) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className={`w-72 glass-strong rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl mb-4 ${shake ? 'animate-shake' : ''}`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/30 to-violet-600/30 p-3 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-bold text-gray-200">Helpful Bot 😈</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                style={hellMode ? { transform: `rotate(${Math.random() * 360}deg)` } : {}}
              >
                <FiX className="text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="h-48 p-3 overflow-y-auto space-y-2 custom-scrollbar"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-2 rounded-xl text-xs ${
                    msg.isBot 
                      ? 'bg-white/10 text-gray-200 rounded-tl-none' 
                      : 'bg-purple-600/40 text-purple-100 rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-2 border-t border-white/10 flex gap-2">
              <input
                type="text"
                placeholder="Type your plea for mercy..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50"
              />
              <button 
                type="submit"
                className="p-1.5 bg-purple-600 rounded-lg text-white hover:bg-purple-500 transition-colors"
              >
                <FiSend className="text-sm" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: hellMode ? 180 : 0 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-2xl ${
          hellMode && !isOpen ? 'animate-bounce' : ''
        }`}
      >
        {isOpen ? <FaGhost /> : <FiMessageSquare className="text-xl" />}
      </motion.button>
    </div>
  );
}
