import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface AnimalUnlockCelebrationProps {
  show: boolean;
  animalEmoji: string;
  animalName: string;
  onClose: () => void;
}

export function AnimalUnlockCelebration({ show, animalEmoji, animalName, onClose }: AnimalUnlockCelebrationProps) {
  if (!show) return null;

  // Auto close after 2 seconds
  setTimeout(onClose, 2000);

  return (
    <motion.div
      className="fixed top-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -20 }}
      transition={{ type: 'spring', duration: 0.5 }}
    >
      <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl border-2 border-emerald-200">
        <div className="text-center">
          <motion.div
            className="text-6xl mb-3"
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 0.6 }}
          >
            {animalEmoji}
          </motion.div>
          <p className="text-lg text-gray-900 mb-1">Unlocked!</p>
          <p className="text-sm text-emerald-600">{animalName} joined your zoo! 🎉</p>
        </div>
      </div>
    </motion.div>
  );
}
