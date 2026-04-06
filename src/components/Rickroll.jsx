import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FiX } from 'react-icons/fi';

export default function Rickroll() {
  const { showRickroll, setShowRickroll } = useApp();

  return (
    <AnimatePresence>
      {showRickroll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rickroll-container"
          onClick={() => setShowRickroll(false)}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative w-full max-w-3xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRickroll(false)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors z-10"
            >
              <FiX className="text-3xl" />
            </button>

            <div className="glass-strong rounded-2xl p-4 border border-purple-500/30">
              <div className="text-center mb-4">
                <h2 className="font-display text-2xl font-bold gradient-text">
                  🛒 Here's your cart! 🛒
                </h2>
                <p className="text-gray-400 text-sm mt-1">Just kidding. You just got Rick Rolled 😈</p>
              </div>

              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&start=0"
                  title="Rick Roll"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-center mt-4 text-purple-400 font-semibold"
              >
                Never gonna give you up, never gonna let you down 🎵
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
