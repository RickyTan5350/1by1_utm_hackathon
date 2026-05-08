import { useState, FormEvent } from 'react';
import { DollarSign, User, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface AddTransactionPageProps {
  onAddTransaction: (transaction: {
    type: 'expense' | 'transfer';
    amount: number;
    category: string;
    recipient?: string;
    description: string;
  }) => void;
}

export function AddTransactionPage({ onAddTransaction }: AddTransactionPageProps) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0 || !recipient.trim()) {
      return;
    }

    onAddTransaction({
      type: 'transfer',
      amount: parseFloat(amount),
      category: 'Transfer',
      recipient: recipient.trim(),
      description,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setAmount('');
    setRecipient('');
    setDescription('');
  };

  return (
    <div className="bg-white pb-8">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl text-gray-900 mb-2">Send Money</h1>
        <p className="text-sm text-gray-500">Transfer funds to someone and keep your wallet current.</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6">
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">Recipient</label>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient name or account"
              className="flex-1 text-base bg-transparent outline-none text-gray-900"
              required
            />
          </div>
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
            placeholder="e.g., Rent transfer"
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0 || !recipient.trim()}
          className="w-full py-4 rounded-2xl shadow-lg transition-all bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-sm">Send Money</span>
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
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-lg text-gray-900">Money Sent!</p>
              <p className="text-sm text-gray-500 mt-1">-RM {amount}</p>
            </motion.div>
          </motion.div>
        )}
      </form>
    </div>
  );
}
