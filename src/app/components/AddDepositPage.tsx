import { useState, FormEvent } from 'react';
import { TrendingUp, Sparkles, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { Goal } from '../types';

interface AddDepositPageProps {
  goal?: Goal;
  onAddDeposit: (transaction: {
    type: 'deposit' | 'fixedDeposit';
    amount: number;
    category: string;
    description: string;
  }) => void;
}

export function AddDepositPage({ goal, onAddDeposit }: AddDepositPageProps) {
  const [type, setType] = useState<'deposit' | 'fixedDeposit'>('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onAddDeposit({
      type,
      amount: parseFloat(amount),
      category: type === 'deposit' ? 'Deposit' : 'Fixed Deposit',
      description,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="bg-white pb-8">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl text-gray-900 mb-2">Add Deposit</h1>
        <p className="text-sm text-gray-500">Grow your wallet and unlock new heroes.</p>
        {goal && (
          <div className="mt-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-700">
            <Sparkles className="inline w-4 h-4 mr-2 align-middle" />
            This deposit contributes to your goal: {goal.name}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="px-6">
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6 grid grid-cols-2 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            onClick={() => setType('deposit')}
            className={`py-3 rounded-xl transition-all ${
              type === 'deposit'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Deposit</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setType('fixedDeposit')}
            className={`py-3 rounded-xl transition-all ${
              type === 'fixedDeposit'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">Fixed Deposit</span>
            </div>
          </button>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">Amount (RM)</label>
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

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">Note (Optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Monthly savings"
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full py-4 rounded-2xl shadow-lg transition-all bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-sm">Save {type === 'deposit' ? 'Deposit' : 'Fixed Deposit'}</span>
        </motion.button>

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
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-lg text-gray-900">Deposit Saved!</p>
              <p className="text-sm text-gray-500 mt-1">+RM {amount}</p>
            </motion.div>
          </motion.div>
        )}
      </form>
    </div>
  );
}

