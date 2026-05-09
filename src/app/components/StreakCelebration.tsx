import { motion } from 'motion/react';
import { Flame } from 'lucide-react';

interface StreakCelebrationProps {
  show: boolean;
  streak: number;
  onClose: () => void;
}

export function StreakCelebration({ show, streak, onClose }: StreakCelebrationProps) {
  if (!show) return null;

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
            <p className="text-sm text-orange-100">Keep building your Hero Center progress.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
