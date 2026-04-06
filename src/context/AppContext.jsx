import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const sarcasticMessages = [
  "Bhai kya kar raha hai tu? 🤦‍♂️",
  "Arre kehna kya chahte ho? 🤔",
  "Maaro mujhe maaro, ye mazaak ho raha hai! 😭",
  "Gajab beizzati hai yaar! 🤡",
  "Chhoti bachi ho kya? 👧",
  "Paisa hi paisa hoga! (Lekin tera nahi) 💸",
  "Control Majnu Control! ✋",
  "Kya bolti public? Sab khatam! 💀",
  "Abe saale! 😠",
  "Mast joke maara re! 😂",
  "Zindagi barbaad ho gaya! 🚮",
  "Sahi khel gaya beta! 🏏",
];

const memeSounds = {
  aag: 'https://www.myinstants.com/media/sounds/aag-laga-di-aag-laga-di.mp3',
  nikal: 'https://www.myinstants.com/media/sounds/nikal-laude-pehele-fursat-main-nikal.mp3',
  bhai: 'https://www.myinstants.com/media/sounds/ashneer-grover-bhai-kya-kar-raha-hai-tu.mp3',
  maaro: 'https://www.myinstants.com/media/sounds/maro-mujhe-maro-meme.mp3',
  beizzati: 'https://www.myinstants.com/media/sounds/gajab-beizzati-hai-meme-sound-effect.mp3',
  paisa: 'https://www.myinstants.com/media/sounds/paisa-hi-paisa-hoga-meme-sound.mp3',
  control: 'https://www.myinstants.com/media/sounds/control-majnu-control.mp3',
  khatam: 'https://www.myinstants.com/media/sounds/ta-ta-bye-bye-khatam-gaya-rahul-gandhi-funny-meme-sound-status-world.mp3',
  saale: 'https://www.myinstants.com/media/sounds/abe-saale-meme-sound-effect-hd.mp3',
  joke: 'https://www.myinstants.com/media/sounds/mast-joke-mara.mp3',
  barbaad: 'https://www.myinstants.com/media/sounds/zindagi-barbaad-ho-gaya.mp3',
  khel: 'https://www.myinstants.com/media/sounds/sahi-khel-gaya-beta.mp3',
  bhau_gaali: 'https://www.myinstants.com/media/sounds/hindustani-bhau-maa-ka-bho.mp3',
};

const gkQuestions = [
  { q: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2 },
  { q: "How many bones does an adult human have?", options: ["196", "206", "216", "256"], answer: 1 },
  { q: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
  { q: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"], answer: 2 },
  { q: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: 1 },
  { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
  { q: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
  { q: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: 2 },
  { q: "What is the longest river in the world?", options: ["Amazon", "Nile", "Mississippi", "Yangtze"], answer: 1 },
  { q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "Shakespeare", "Mark Twain", "Jane Austen"], answer: 1 },
];

export function AppProvider({ children }) {
  const [hellMode, setHellMode] = useState(true);
  const [cart, setCart] = useState([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showRickroll, setShowRickroll] = useState(false);

  const toggleMode = () => setHellMode(prev => !prev);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });

    const msg = sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)];
    addToast(msg, 'sarcastic');
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const getRandomQuestion = useCallback(() => {
    return gkQuestions[Math.floor(Math.random() * gkQuestions.length)];
  }, []);

  const playMeme = useCallback((name) => {
    if (!memeSounds[name]) return;
    try {
      const audio = new Audio(memeSounds[name]);
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
      console.log("Audio error:", e);
    }
  }, []);

  const playSound = useCallback((type) => {
    if (hellMode) {
      // In Hell Mode, we play random memes for types
      const typesToMemes = {
        'error': ['nikal', 'saale', 'bhai', 'beizzati', 'bhau_gaali'],
        'success': ['joke', 'paisa', 'khel'],
        'evil': ['maaro', 'khatam', 'barbaad', 'bhau_gaali'],
        'pay': ['paisa', 'aag'],
        'click': ['control']
      };
      
      const options = typesToMemes[type] || ['control'];
      const meme = options[Math.floor(Math.random() * options.length)];
      playMeme(meme);
    }

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      switch (type) {
        case 'click':
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
          break;
        case 'error':
          oscillator.frequency.value = 200;
          oscillator.type = 'sawtooth';
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.3);
          break;
        case 'success':
          oscillator.frequency.value = 523;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.1;
          oscillator.start();
          setTimeout(() => {
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.frequency.value = 659;
            osc2.type = 'sine';
            gain2.gain.value = 0.1;
            osc2.start();
            osc2.stop(audioCtx.currentTime + 0.15);
          }, 100);
          oscillator.stop(audioCtx.currentTime + 0.1);
          break;
        case 'evil':
          oscillator.frequency.value = 150;
          oscillator.type = 'square';
          gainNode.gain.value = 0.08;
          oscillator.start();
          oscillator.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.5);
          oscillator.stop(audioCtx.currentTime + 0.5);
          break;
        case 'pay':
          oscillator.frequency.value = 440;
          oscillator.type = 'triangle';
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.2);
          oscillator.stop(audioCtx.currentTime + 0.3);
          break;
        default:
          oscillator.frequency.value = 440;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.05;
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
      }
    } catch (e) {
      // Audio context not available
    }
  }, []);

  const value = {
    hellMode,
    toggleMode,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    hasPaid,
    setHasPaid,
    toasts,
    addToast,
    showRickroll,
    setShowRickroll,
    getRandomQuestion,
    playSound,
    playMeme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
