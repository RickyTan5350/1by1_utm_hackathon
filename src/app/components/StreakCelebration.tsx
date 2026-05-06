import { motion } from 'motion/react';
import { Flame, Coins } from 'lucide-react';

interface StreakCelebrationProps {
  show: boolean;
  streak: number;
  coinsEarned: number;
  onClose: () => void;
}

export function StreakCelebration({ show, streak, coinsEarned, onClose }: StreakCelebrationProps) {
  if (!show) return null;

  // Auto close after 2 seconds
  setTimeout(onClose, 2000);

  return (
    <motion.div
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', duration: 0.6 }}
    >
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1.2, 1.2, 1]
            }}
            transition={{ duration: 0.6 }}
          >
            <Flame className="w-8 h-8" />
          </motion.div>
          <div>
            <p className="text-lg">Day {streak} Streak! 🔥</p>
            <div className="flex items-center gap-2 text-yellow-200 text-sm">
              <Coins className="w-4 h-4" />
              <span>+{coinsEarned} coins earned!</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
