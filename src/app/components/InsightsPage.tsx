import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Zap, ChevronRight, Plus, Sparkles, RotateCcw } from 'lucide-react';
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
  const transferTotal = transactions.filter(t => t.type === 'transfer').reduce((sum, t) => sum + t.amount, 0);
  const baseTotalSpent = spendingBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = baseTotalSpent + transferTotal;
  const savingsRate = totalSpent > 0 ? (userStats.totalSavings / (userStats.totalSavings + totalSpent)) * 100 : 0;

  const topSpendingCategory = spendingBreakdown[0];
  const canSaveMore = userStats.totalSpending > userStats.totalSavings * 0.3;
  const recentTransactions = transactions.slice(0, 5);
  const goalProgress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const visibleRecent = expandedRecent ? recentTransactions : recentTransactions.slice(0, 2);

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{summary: string, suggestion: string} | null>(null);

  const handleGenerateRecommendation = () => {
    setIsGeneratingAi(true);
    
    setTimeout(() => {
      const spendingTotal = totalSpent;
      const savingTotal = userStats.totalSavings;
      
      let suggestion = '';
      let summary = `You have spent RM ${spendingTotal.toFixed(0)} and saved RM ${savingTotal.toLocaleString()} this month. You also have transferred RM ${transferTotal.toFixed(0)} recently.`;
      
      const isHighSpender = spendingTotal > savingTotal * 2;
      const isGreatSaver = savingTotal > spendingTotal * 1.5;
      const isHighTransfer = transferTotal > spendingTotal && transferTotal > 0;
      const noSavings = savingTotal === 0;

      const highSpenderSuggestions = [
        "Your spending is quite high compared to your savings. Try to identify one or two non-essential expenses to cut down this week.",
        "You're overspending! Let's pause any impulse purchases for the next few days and focus on redirecting that money into your savings account.",
        "Warning: High cash outflow detected! Review your top spending categories and set a strict budget for the rest of the month."
      ];

      const greatSaverSuggestions = [
        "Outstanding job saving! Consider putting some of those excess funds into a fixed deposit or low-risk investment to earn passive income.",
        "You are a master saver! Since your savings are growing steadily, maybe treat yourself to a small reward, and invest the rest for long-term wealth.",
        "Your savings rate is impressive. Keep up the momentum! To maximize returns, look into diversifying your savings into high-yield accounts."
      ];

      const highTransferSuggestions = [
        "You have a balanced spending habit, but your transfers are unusually high. Make sure you are tracking where those funds are going to avoid hidden leaks.",
        "You're transferring a lot of money out. If these are going to another savings account, great! If not, try to monitor your transfers more closely."
      ];

      const noSavingsSuggestions = [
        "You haven't saved anything yet! The golden rule is to pay yourself first. Try to set aside at least 10% of your income into savings as soon as you receive it.",
        "Your savings balance needs attention. Start small: try saving just RM 10 or RM 20 a week. It builds up faster than you think!"
      ];

      const balancedSuggestions = [
        "You have a very balanced spending and saving habit. Keep it up! Consistency is the key to financial success.",
        "You're on the right track! Your finances are stable. Keep an eye on any unexpected expenses and maintain this healthy balance."
      ];

      const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

      if (noSavings) {
        suggestion = pickRandom(noSavingsSuggestions);
      } else if (isHighSpender) {
        suggestion = pickRandom(highSpenderSuggestions);
      } else if (isGreatSaver) {
        suggestion = pickRandom(greatSaverSuggestions);
      } else if (isHighTransfer) {
        suggestion = pickRandom(highTransferSuggestions);
      } else {
        suggestion = pickRandom(balancedSuggestions);
      }
      
      setAiRecommendation({ summary, suggestion });
      setIsGeneratingAi(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-24">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
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
      <div className="px-4 -mt-6 relative z-10">
        {/* Personalized AI Recommendation Button */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <h3 className="font-semibold text-lg">Personalized AI Coach</h3>
            </div>
            {!aiRecommendation ? (
               <div>
                 <p className="text-indigo-100 text-sm mb-4">
                   Get a customized financial review based on your recent spending, savings, and transfers.
                 </p>
                 <button 
                   onClick={handleGenerateRecommendation}
                   disabled={isGeneratingAi}
                   className="w-full bg-white text-indigo-600 rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-80"
                 >
                   {isGeneratingAi ? (
                     <>
                       <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                       Analyzing your finances...
                     </>
                   ) : (
                     'Generate Recommendation'
                   )}
                 </button>
               </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
              >
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Summary</span>
                  <p className="text-sm mt-1">{aiRecommendation.summary}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Suggestion</span>
                  <p className="text-sm mt-1 font-medium text-yellow-100">{aiRecommendation.suggestion}</p>
                </div>
                <button 
                  onClick={() => setAiRecommendation(null)}
                  className="mt-4 text-xs text-indigo-200 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Regenerate
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Current Goal (moved from profile) */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5"
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
          className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-5"
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
                        transaction.type === 'deposit' || transaction.type === 'fixedDeposit'
                          ? 'bg-emerald-100'
                          : 'bg-red-100'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'fixedDeposit' ? (
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
                      transaction.type === 'deposit' || transaction.type === 'fixedDeposit'
                        ? 'text-emerald-700'
                        : 'text-red-700'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'fixedDeposit' ? '+' : '-'}RM {transaction.amount.toFixed(0)}
                    </p>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-6">No transactions yet</p>
                )}
                {onAddTransaction && (
                  <button
                    onClick={onAddTransaction}
                    className="w-full mt-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl min-h-11 py-2 text-sm border border-gray-200 transition-colors"
                  >
                    Send Money
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
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-3 border-l-4 border-yellow-500">
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border-l-4 border-blue-500">
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

        {/* Personalized AI Recommendation Button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <h3 className="font-semibold text-lg">Personalized AI Coach</h3>
            </div>
            
            {!aiRecommendation ? (
               <div>
                 <p className="text-indigo-100 text-sm mb-4">
                   Get a customized financial review based on your recent spending, savings, and transfers.
                 </p>
                 <button 
                   onClick={handleGenerateRecommendation}
                   disabled={isGeneratingAi}
                   className="w-full bg-white text-indigo-600 rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-80"
                 >
                   {isGeneratingAi ? (
                     <>
                       <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                       Analyzing your finances...
                     </>
                   ) : (
                     'Generate Recommendation'
                   )}
                 </button>
               </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
              >
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Summary</span>
                  <p className="text-sm mt-1">{aiRecommendation.summary}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Suggestion</span>
                  <p className="text-sm mt-1 font-medium text-yellow-100">{aiRecommendation.suggestion}</p>
                </div>
                <button 
                  onClick={() => setAiRecommendation(null)}
                  className="mt-4 text-xs text-indigo-200 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Regenerate
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

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