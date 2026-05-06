import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Zap, ChevronRight, Plus } from 'lucide-react';
import { AIInsight, SpendingBreakdown, UserStats, Goal, Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface InsightsPageProps {
  insights: AIInsight[];
  spendingBreakdown: SpendingBreakdown[];
  userStats: UserStats;
  goal: Goal;
  transactions: Transaction[];
  onAddTransaction?: () => void;
}

export function InsightsPage({ insights, spendingBreakdown, userStats, goal, transactions, onAddTransaction }: InsightsPageProps) {
  const [expandedRecent, setExpandedRecent] = useState(false);
  const totalSpent = spendingBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const savingsRate = totalSpent > 0 ? (userStats.totalSavings / (userStats.totalSavings + totalSpent)) * 100 : 0;

  const topSpendingCategory = spendingBreakdown[0];
  const canSaveMore = userStats.totalSpending > userStats.totalSavings * 0.3;
  const recentTransactions = transactions.slice(0, 5);
  const goalProgress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const visibleRecent = expandedRecent ? recentTransactions : recentTransactions.slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-24">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Brain className="w-7 h-7" />
              <h1 className="text-2xl">AI Financial Coach</h1>
            </div>
            <p className="text-indigo-100 text-sm">
              Smart insights to boost your savings
            </p>
          </div>
          {onAddTransaction && (
            <motion.button
              onClick={onAddTransaction}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm hover:bg-white/30 active:scale-95 transition-all shadow-lg flex items-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              Add
            </motion.button>
          )}
        </div>
      </div>

      {/* Overlay content under header (consistent with other pages) */}
      <div className="px-6 -mt-6 relative z-10">
        {/* Current Goal (moved from profile) */}
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 mb-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-indigo-600" />
                <p className="text-xs text-indigo-700 uppercase tracking-wide">Current Goal</p>
              </div>
              <p className="text-base text-indigo-900 truncate">{goal.name}</p>
              <p className="text-xs text-indigo-700 mt-1">
                RM {goal.currentAmount.toLocaleString()} / RM {goal.targetAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg text-indigo-900">{Math.round(goalProgress)}%</p>
              <p className="text-xs text-indigo-700">{goal.estimatedDays} days</p>
            </div>
          </div>
          <div className="mt-3 h-2 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </motion.div>

        {/* This Month - detailed breakdown (before recent activity) */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide">This Month</h3>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Spent</p>
                <p className="text-sm text-red-600">RM {totalSpent.toFixed(0)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Saved</p>
                <p className="text-sm text-green-600">RM {userStats.totalSavings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {spendingBreakdown.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">RM {item.amount.toFixed(0)}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.08 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity (collapsible) */}
        <motion.div
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          <button
            onClick={() => setExpandedRecent((v) => !v)}
            className="w-full flex items-center justify-between"
          >
            <div className="text-left">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide">Recent Activity</h3>
              <p className="text-xs text-gray-400 mt-1">
                {expandedRecent ? '收起' : '展开'}（{recentTransactions.length}）
              </p>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedRecent ? 'rotate-90' : ''}`} />
          </button>

          <AnimatePresence initial={false}>
            <motion.div
              key={expandedRecent ? 'expanded' : 'collapsed'}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2">
                {visibleRecent.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        transaction.type === 'saving' ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'saving' ? (
                          <TrendingUp className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-700" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-900 truncate">{transaction.category}</p>
                        <p className="text-[11px] text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`text-sm flex-shrink-0 ${
                      transaction.type === 'saving' ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      {transaction.type === 'saving' ? '+' : '-'}RM {transaction.amount.toFixed(0)}
                    </p>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-6">No transactions yet</p>
                )}
                {onAddTransaction && (
                  <button
                    onClick={onAddTransaction}
                    className="w-full mt-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl py-3 text-sm border border-gray-200 transition-colors"
                  >
                    Add Transaction
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Action items (kept, after recent activity) */}
        {(canSaveMore || topSpendingCategory) && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Action Items</h3>
            <div className="space-y-2">
              {canSaveMore && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border-l-4 border-yellow-500">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500 text-white flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-0.5">每周少花 RM 50</p>
                    <p className="text-xs text-gray-500">更快达成目标（保持习惯即可）</p>
                  </div>
                </div>
              )}
              {topSpendingCategory && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-0.5">{topSpendingCategory.category} 占比偏高</p>
                    <p className="text-xs text-gray-500">先从一项可控支出开始优化</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* AI Recommendations - Card Style */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-3">Smart Tips</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-xs text-green-900 mb-1">Save</p>
              <p className="text-lg text-green-600">+15%</p>
              <p className="text-xs text-green-700">vs last month</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <Lightbulb className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-xs text-blue-900 mb-1">Insight</p>
              <p className="text-xs text-blue-700">Cut RM 30/week on dining</p>
            </div>
          </div>
        </motion.div>

        {/* Detailed Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-3">More Insights</h3>
          <div className="space-y-2">
            {insights.slice(0, 3).map((insight, index) => (
              <button
                key={insight.id}
                className="w-full bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">{insight.message}</p>
                    <p className="text-xs text-gray-600">{insight.actionable}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
