import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { FaSkull } from 'react-icons/fa';

export default function ToastContainer() {
  const { toasts } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'sarcastic': return <FaSkull className="text-purple-400" />;
      case 'error': return <FiAlertTriangle className="text-red-400" />;
      case 'success': return <FiInfo className="text-green-400" />;
      default: return <FiInfo className="text-blue-400" />;
    }
  };

  const getBorder = (type) => {
    switch (type) {
      case 'sarcastic': return 'border-purple-500/30';
      case 'error': return 'border-red-500/30';
      case 'success': return 'border-green-500/30';
      default: return 'border-blue-500/30';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 200, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 200, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`glass-strong rounded-xl px-4 py-3 flex items-start gap-3 border ${getBorder(toast.type)} shadow-2xl`}
          >
            <span className="text-lg mt-0.5">{getIcon(toast.type)}</span>
            <p className="text-sm text-gray-200 flex-1">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
