import { User, TrendingUp, TrendingDown, Calendar, Trophy, Flame, Settings, LogOut, ChevronRight } from 'lucide-react';
import { UserStats, Goal, Transaction } from '../types';
import { motion } from 'motion/react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface ProfilePageProps {
  userStats: UserStats;
  goal: Goal;
  transactions: Transaction[];
  onAddTransaction?: () => void;
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

export function ProfilePage({ userStats, goal, transactions, onAddTransaction, currentTheme, onThemeChange }: ProfilePageProps) {
  const recentTransactions = transactions.slice(0, 5);
  const thisMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const monthlySpent = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlySaved = thisMonthTransactions
    .filter(t => t.type === 'deposit' || t.type === 'fixedDeposit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="flex-1">
            <h1 className="text-2xl mb-1">My Profile</h1>
            <p className="text-gray-300 text-sm">Financial Journey Tracker</p>
          </div>
          <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Flame className="w-5 h-5 mx-auto mb-1 text-orange-300" />
            <p className="text-lg">{userStats.streak}</p>
            <p className="text-xs text-gray-300">Day Streak</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-purple-300" />
            <p className="text-lg">RM {userStats.walletBalance.toLocaleString()}</p>
            <p className="text-xs text-gray-300">Wallet Balance</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-purple-300" />
            <p className="text-lg">{userStats.animalsCollected}</p>
            <p className="text-xs text-gray-300">Animals</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-5">
        {/* This Month Summary */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h3 className="text-sm text-gray-500 uppercase tracking-wide">This Month</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <p className="text-xs text-gray-500">Spent</p>
              </div>
              <p className="text-2xl text-red-600">RM {monthlySpent.toFixed(0)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <p className="text-xs text-gray-500">Saved</p>
              </div>
              <p className="text-2xl text-green-600">RM {monthlySaved.toFixed(0)}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Net Change</span>
              <span className={`${monthlySaved > monthlySpent ? 'text-green-600' : 'text-red-600'}`}>
                {monthlySaved > monthlySpent ? '+' : ''}RM {(monthlySaved - monthlySpent).toFixed(0)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Settings Section */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-3">Settings</h3>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-900">App Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-900">Sign Out</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
