import { useState } from 'react';
import { DollarSign, TrendingDown, TrendingUp, ShoppingBag, Utensils, Film, Car, Home, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface AddTransactionPageProps {
  onAddTransaction: (transaction: {
    type: 'expense' | 'saving';
    amount: number;
    category: string;
    description: string;
  }) => void;
}

const expenseCategories = [
  { id: 'food', name: 'Food', icon: Utensils, color: 'bg-green-500' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-blue-500' },
  { id: 'entertainment', name: 'Entertainment', icon: Film, color: 'bg-amber-500' },
  { id: 'transport', name: 'Transport', icon: Car, color: 'bg-purple-500' },
  { id: 'housing', name: 'Housing', icon: Home, color: 'bg-red-500' },
  { id: 'other', name: 'Other', icon: Tag, color: 'bg-gray-500' },
];

export function AddTransactionPage({ onAddTransaction }: AddTransactionPageProps) {
  const [type, setType] = useState<'expense' | 'saving'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    onAddTransaction({
      type,
      amount: parseFloat(amount),
      category: type === 'saving' ? 'Savings' : category,
      description
    });

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    // Reset form
    setAmount('');
    setDescription('');
  };

  return (
    <div className="bg-white pb-8">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl text-gray-900 mb-2">Add Transaction</h1>
        <p className="text-sm text-gray-500">Track your spending and savings</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6">
        {/* Type Toggle */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6 grid grid-cols-2 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-3 rounded-xl transition-all ${
              type === 'expense'
                ? 'bg-red-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingDown className="w-5 h-5" />
              <span className="text-sm">Expense</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setType('saving')}
            className={`py-3 rounded-xl transition-all ${
              type === 'saving'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Saving</span>
            </div>
          </button>
        </motion.div>

        {/* Amount Input */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">
            Amount (RM)
          </label>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-gray-400" />
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 text-3xl bg-transparent outline-none text-gray-900"
              required
            />
          </div>
        </motion.div>

        {/* Category Selection (Expenses Only) */}
        {type === 'expense' && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">
              Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              {expenseCategories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all ${
                      category === cat.id
                        ? 'border-emerald-500 ring-2 ring-emerald-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${cat.color} flex items-center justify-center mx-auto mb-2`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-gray-700 text-center">{cat.name}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Lunch at cafe"
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0}
          className={`w-full py-4 rounded-2xl shadow-lg transition-all ${
            type === 'expense'
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-sm">
            {type === 'expense' ? 'Add Expense' : 'Add Savings'}
          </span>
        </motion.button>

        {/* Success Animation Placeholder */}
        {showSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
              <div className={`w-16 h-16 rounded-full ${
                type === 'expense' ? 'bg-red-100' : 'bg-emerald-100'
              } flex items-center justify-center mx-auto mb-3`}>
                {type === 'expense' ? (
                  <TrendingDown className="w-8 h-8 text-red-600" />
                ) : (
                  <TrendingUp className="w-8 h-8 text-emerald-600" />
                )}
              </div>
              <p className="text-lg text-gray-900">Transaction Added!</p>
              <p className="text-sm text-gray-500 mt-1">
                {type === 'expense' ? '-' : '+'}RM {amount}
              </p>
            </motion.div>
          </motion.div>
        )}
      </form>

      {/* Coin Earning Info */}
      {type === 'saving' && (
        <motion.div
          className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-5 border border-yellow-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <p className="text-sm text-yellow-900 mb-2">💰 Earn Coins from Savings!</p>
          <p className="text-xs text-yellow-700">
            For every RM 1 saved, you earn 10 coins to unlock animals in your zoo
          </p>
        </motion.div>
      )}
    </div>
  );
}
