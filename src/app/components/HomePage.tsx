import { useState } from 'react';
import { Target, TrendingUp, Coins, Flame, Sparkles, Plus, TrendingDown } from 'lucide-react';
import { Goal, UserStats, AIInsight } from '../types';
import { motion } from 'motion/react';
import { StreakCelebration } from './StreakCelebration';
import { ColorTheme } from '../data/themes';

interface HomePageProps {
  goal: Goal;
  userStats: UserStats;
  topInsight: AIInsight;
  onNavigateToAdd?: () => void;
  onCheckIn?: () => void;
  theme: ColorTheme;
}

export function HomePage({ goal, userStats, topInsight, onNavigateToAdd, onCheckIn, theme }: HomePageProps) {
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [lastStreak, setLastStreak] = useState(userStats.streak);

  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;

  const handleCheckIn = () => {
    const newStreak = userStats.streak + 1;
    const coinsEarned = Math.min(newStreak, 30);
    setLastStreak(userStats.streak);
    onCheckIn?.();
    setShowStreakCelebration(true);
  };

  // Streak fire colors based on streak level
  const getStreakFireColor = (streak: number) => {
    if (streak >= 30) return { color: 'text-purple-300', glow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]', bg: 'from-purple-500 to-purple-600' };
    if (streak >= 21) return { color: 'text-blue-300', glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]', bg: 'from-blue-500 to-blue-600' };
    if (streak >= 14) return { color: 'text-cyan-300', glow: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]', bg: 'from-cyan-500 to-cyan-600' };
    if (streak >= 7) return { color: 'text-red-300', glow: 'drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]', bg: 'from-red-500 to-red-600' };
    return { color: 'text-orange-300', glow: 'drop-shadow-[0_0_6px_rgba(251,146,60,0.6)]', bg: 'from-orange-500 to-orange-600' };
  };

  const streakStyle = getStreakFireColor(userStats.streak);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${theme.colors.gradient.from} ${theme.colors.gradient.to} text-white px-4 pt-12 pb-8 rounded-b-3xl shadow-lg`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-emerald-100 text-sm">Welcome back!</p>
            <h1 className="text-2xl mt-1">ZooSave</h1>
          </div>
          <motion.div
            className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Coins className="w-5 h-5 text-yellow-300" />
            <span className="text-lg">{userStats.coins}</span>
          </motion.div>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-3">
          <motion.div
            className={`flex items-center gap-2 bg-gradient-to-r ${streakStyle.bg} px-4 py-2 rounded-full shadow-lg`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Flame className={`w-5 h-5 ${streakStyle.color} ${streakStyle.glow}`} />
            </motion.div>
            <motion.span
              key={userStats.streak}
              className="text-sm text-white"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              {userStats.streak} day streak
            </motion.span>
          </motion.div>

          {onCheckIn && (
            <motion.button
              onClick={handleCheckIn}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm hover:bg-white/30 active:scale-95 transition-all shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileTap={{ scale: 0.9 }}
            >
              Check In Today
            </motion.button>
          )}
        </div>
      </div>

      <div className="px-4 -mt-6">
        {/* Goal Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative h-40">
            <img
              src={goal.imageUrl}
              alt={goal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide opacity-90">Current Goal</span>
              </div>
              <h2 className="text-xl">{goal.name}</h2>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-2xl text-emerald-600">RM {goal.currentAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">of RM {goal.targetAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl">{Math.round(progressPercentage)}%</p>
                <p className="text-xs text-gray-500">{goal.estimatedDays} days left</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <button
            onClick={onNavigateToAdd}
            className="rounded-2xl p-4 min-h-28 shadow-lg hover:shadow-xl active:scale-95 transition-all"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-white text-sm mb-1">Add Saving</p>
            <p className="text-white/80 text-xs">Earn coins & grow zoo</p>
          </button>

          <button
            onClick={onNavigateToAdd}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 min-h-28 shadow-lg hover:shadow-xl active:scale-95 transition-all"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-white text-sm mb-1">Add Expense</p>
            <p className="text-blue-100 text-xs">Track your spending</p>
          </button>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <p className="text-xl text-emerald-600">RM {userStats.totalSavings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Total Saved</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <p className="text-xl text-purple-600">{userStats.animalsCollected}</p>
              <p className="text-xs text-gray-500 mt-1">Animals Collected</p>
            </div>
          </div>
        </motion.div>

        {/* AI Insight Preview */}
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 shadow-sm border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-900 mb-1">AI Insight</p>
              <p className="text-sm text-blue-700 mb-2">{topInsight.message}</p>
              <p className="text-xs text-blue-600 bg-white/60 px-3 py-2 rounded-lg">
                💡 {topInsight.actionable}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Streak Celebration */}
      <StreakCelebration
        show={showStreakCelebration}
        streak={userStats.streak}
        coinsEarned={Math.min(userStats.streak, 30)}
        onClose={() => setShowStreakCelebration(false)}
      />
    </div>
  );
}
