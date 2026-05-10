import { useState } from 'react';

interface AddSpendingPageProps {
  onAddSpending: (transaction: { amount: number; category: string; description: string }) => void;
  onClose?: () => void;
}

export function AddSpendingPage({ onAddSpending, onClose }: AddSpendingPageProps) {
  const [spendingCategory, setSpendingCategory] = useState('Food');
  const [spendingAmount, setSpendingAmount] = useState('');
  const [spendingDescription, setSpendingDescription] = useState('');

  const spendingCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'];

  const handleAddSpending = () => {
    const amount = parseFloat(spendingAmount);
    if (isNaN(amount) || amount <= 0) return;

    onAddSpending({
      amount,
      category: spendingCategory,
      description: spendingDescription,
    });
    
    setSpendingAmount('');
    setSpendingDescription('');
    if (onClose) onClose();
  };

  return (
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
  );
}
