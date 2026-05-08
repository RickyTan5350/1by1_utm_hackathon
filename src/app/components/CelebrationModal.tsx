import { motion } from 'motion/react';
import { Sparkles, Gift } from 'lucide-react';

interface CelebrationModalProps {
  show: boolean;
  message: string;
  reward: number;
  emoji: string;
  onClose: () => void;
}

export function CelebrationModal({ show, message, reward, emoji, onClose }: CelebrationModalProps) {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-4 text-center relative overflow-hidden"
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        transition={{ type: 'spring', duration: 0.6 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sparkle effects */}
        <motion.div
          className="absolute top-4 left-4"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>
        <motion.div
          className="absolute top-4 right-4"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-8"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 text-blue-400" />
        </motion.div>
        <motion.div
          className="absolute bottom-4 right-8"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
        </motion.div>

        {/* Main content */}
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mx-auto mb-4"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-5xl">{emoji}</span>
        </motion.div>

        <h2 className="text-2xl text-gray-900 mb-2">Combo Complete! 🎉</h2>
        <p className="text-sm text-gray-600 mb-4">{message}</p>

        <motion.div
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4 px-6 rounded-2xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <Gift className="w-6 h-6 mx-auto mb-2" />
          <p className="text-2xl">+RM {reward}</p>
        </motion.div>

        <button
          onClick={onClose}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl transition-colors"
        >
          Awesome!
        </button>
      </motion.div>
    </motion.div>
  );
}
