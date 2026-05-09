import { useState } from 'react';
import { TrendingUp, Flame, Sparkles, TrendingDown } from 'lucide-react';
import { Goal, UserStats, AIInsight, Animal } from '../types';
import { motion } from 'motion/react';
import { StreakCelebration } from './StreakCelebration';
import { ColorTheme } from '../data/themes';
import { ChromakeyVideo } from './ChromakeyVideo';

interface HomePageProps {
  goal: Goal;
  animals: Animal[];
  userStats: UserStats;
  topInsight: AIInsight;
  onNavigateToDeposit?: () => void;
  onNavigateToTransaction?: () => void;
  onAddSpending?: (transaction: { amount: number; category: string; description: string }) => void;
  theme: ColorTheme;
}

export function HomePage({ goal, animals, userStats, topInsight, onNavigateToDeposit, onNavigateToTransaction, onAddSpending, theme }: HomePageProps) {
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showAddSpending, setShowAddSpending] = useState(false);
  const [spendingCategory, setSpendingCategory] = useState('Food');
  const [spendingAmount, setSpendingAmount] = useState('');
  const [spendingDescription, setSpendingDescription] = useState('');

  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;

  const handleAddSpending = () => {
    const amount = parseFloat(spendingAmount);
    if (!onAddSpending || isNaN(amount) || amount <= 0) return;

    setShowStreakCelebration(true);
    onAddSpending({
      amount,
      category: spendingCategory,
      description: spendingDescription,
    });
    setShowAddSpending(false);
    setSpendingAmount('');
    setSpendingDescription('');
  };

  const getStreakFireColor = (streak: number) => {
    if (streak >= 30) return { color: 'text-purple-300', glow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]', bg: 'from-purple-500 to-purple-600' };
    if (streak >= 21) return { color: 'text-blue-300', glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]', bg: 'from-blue-500 to-blue-600' };
    if (streak >= 14) return { color: 'text-cyan-300', glow: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]', bg: 'from-cyan-500 to-cyan-600' };
    if (streak >= 7) return { color: 'text-red-300', glow: 'drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]', bg: 'from-red-500 to-red-600' };
    return { color: 'text-orange-300', glow: 'drop-shadow-[0_0_6px_rgba(251,146,60,0.6)]', bg: 'from-orange-500 to-orange-600' };
  };

  const streakStyle = getStreakFireColor(userStats.streak);
  const featuredAnimal =
    animals.find(animal => !animal.isUnlocked && !animal.name.toLowerCase().includes('pig')) ??
    animals.find(animal => !animal.isUnlocked) ??
    animals[0];

  const spendingCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div
        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 pt-12 pb-8 rounded-b-3xl shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-blue-100 text-sm">Welcome back!</p>
            <h1 className="text-2xl mt-1">Alex Lim</h1>
          </div>
          <motion.div
            className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">Wallet</span>
              <p className="text-lg font-semibold">RM {userStats.walletBalance.toLocaleString()}</p>
            </div>
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

          {onAddSpending && (
            <motion.button
              onClick={() => setShowAddSpending(true)}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm hover:bg-white/30 active:scale-95 transition-all shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileTap={{ scale: 0.9 }}
            >
              Add Spending
            </motion.button>
          )}
        </div>
      </div>

      <div className="px-4 -mt-6">
        {/* Featured Animal Mockup Style */}
        <motion.div
          className="bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-100 p-2 rounded-[2rem] shadow-lg mb-5 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div 
            className="relative h-60 rounded-[1.5rem] overflow-hidden bg-repeat"
            style={{ backgroundImage: 'url("/img/garden.png")', backgroundSize: '400px' }}
          >
            <ChromakeyVideo
              src="/img/cat_move.mp4"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20"
              threshold={230}
            />
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
            onClick={onNavigateToDeposit}
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
            <p className="text-white text-sm mb-1">Add Deposit</p>
            <p className="text-white/80 text-xs">Grow your wallet</p>
          </button>

          <button
            onClick={onNavigateToTransaction}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 min-h-28 shadow-lg hover:shadow-xl active:scale-95 transition-all"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-white text-sm mb-1">Send Money</p>
            <p className="text-blue-100 text-xs">Transfer funds to someone</p>
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
              <p className="text-xs text-gray-500 mt-1">Heroes Recruited</p>
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

      <StreakCelebration
        show={showStreakCelebration}
        streak={userStats.streak}
        onClose={() => setShowStreakCelebration(false)}
      />

      {showAddSpending && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="min-h-screen flex items-end sm:items-center justify-center py-10">
              <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowAddSpending(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                >
                  ✕
                </button>
                <div className="px-6 pt-6 pb-8">
                  <h1 className="text-2xl text-gray-900 mb-2">Add Spending</h1>
                  <p className="text-sm text-gray-500 mb-4">Choose a category and log your spending to keep your streak rolling.</p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Category</p>
                      <div className="grid grid-cols-2 gap-2">
                        {spendingCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setSpendingCategory(category)}
                            className={`rounded-2xl border px-4 py-3 text-sm text-left transition-all ${
                              spendingCategory === category
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Amount (RM)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={spendingAmount}
                        onChange={(e) => setSpendingAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-2xl border border-gray-200 px-4 py-4 text-xl text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Note (Optional)</label>
                      <input
                        type="text"
                        value={spendingDescription}
                        onChange={(e) => setSpendingDescription(e.target.value)}
                        placeholder="e.g., Lunch, bus fare"
                        className="w-full rounded-2xl border border-gray-200 px-4 py-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <button
                      onClick={handleAddSpending}
                      disabled={!spendingAmount || parseFloat(spendingAmount) <= 0}
                      className="w-full py-4 rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Spending
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
