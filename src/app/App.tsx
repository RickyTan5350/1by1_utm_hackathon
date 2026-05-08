import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ZooPage } from './components/ZooPage';
import { InsightsPage } from './components/InsightsPage';
import { AddTransactionPage } from './components/AddTransactionPage';
import { ProfilePage } from './components/ProfilePage';
import { BottomNav } from './components/BottomNav';
import {
  mockGoal,
  mockTransactions,
  mockAnimals,
  mockAIInsights,
  mockUserStats,
  mockSpendingBreakdown
} from './data/mockData';
import { Transaction, Animal, UserStats } from './types';
import { animalCombos, getComboProgress } from './data/combos';
import { getTheme } from './data/themes';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [claimedCombos, setClaimedCombos] = useState<string[]>([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [theme, setTheme] = useState('emerald');

  const applySavingsDeposit = (amount: number) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'saving',
      amount,
      category: 'Deposit',
      date: new Date().toISOString().split('T')[0],
      description: 'Saving account deposit',
    };

    setTransactions(prev => [transaction, ...prev]);

    setUserStats(prev => ({
      ...prev,
      totalSavings: prev.totalSavings + amount,
      coins: prev.coins + Math.floor(amount * 10),
    }));

    mockGoal.currentAmount += amount;

    setAnimals(prev =>
      prev.map(animal => {
        if (
          animal.unlockCondition.type === 'milestone' &&
          animal.unlockCondition.value <= userStats.totalSavings + amount &&
          !animal.isUnlocked
        ) {
          return { ...animal, isUnlocked: true };
        }
        return animal;
      })
    );
  };

  const handleAddTransaction = (newTransaction: {
    type: 'expense' | 'saving';
    amount: number;
    category: string;
    description: string;
  }) => {
    if (newTransaction.type === 'saving') {
      applySavingsDeposit(newTransaction.amount);
    } else {
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: newTransaction.type,
        amount: newTransaction.amount,
        category: newTransaction.category,
        date: new Date().toISOString().split('T')[0],
        description: newTransaction.description,
      };
      setTransactions(prev => [transaction, ...prev]);
      setUserStats(prev => ({
        ...prev,
        totalSpending: prev.totalSpending + newTransaction.amount,
      }));
    }

    // Close modal and navigate to home
    setShowAddTransaction(false);
    setTimeout(() => setCurrentPage('home'), 500);
  };

  const handleDepositSubmit = () => {
    const amount = Number(depositAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    applySavingsDeposit(amount);
    setDepositAmount('');
    setShowDepositModal(false);
    setCurrentPage('home');
  };

  const handleCheckIn = () => {
    setUserStats({
      ...userStats,
      streak: userStats.streak + 1,
      coins: userStats.coins + Math.min(userStats.streak + 1, 30), // Increasing coin reward up to 30
    });
  };

  const handleUnlockAnimal = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;

    if (animal.unlockCondition.type === 'coins' && userStats.coins >= animal.unlockCondition.value) {
      setAnimals(animals.map(a =>
        a.id === animalId ? { ...a, isUnlocked: true } : a
      ));
      setUserStats({
        ...userStats,
        coins: userStats.coins - animal.unlockCondition.value,
        animalsCollected: userStats.animalsCollected + 1,
      });
    }
  };

  const handleClaimCombo = (comboId: string) => {
    const combo = animalCombos.find(c => c.id === comboId);
    if (!combo) return;

    const unlockedAnimalIds = animals.filter(a => a.isUnlocked).map(a => a.id);
    const progress = getComboProgress(combo, unlockedAnimalIds);

    if (progress.completed && !claimedCombos.includes(comboId)) {
      setClaimedCombos([...claimedCombos, comboId]);
      setUserStats({
        ...userStats,
        coins: userStats.coins + combo.reward.value,
      });
    }
  };

  const currentTheme = getTheme(theme);

  return (
    <div
      className="max-w-md mx-auto bg-[#071623] min-h-screen relative overflow-hidden"
      style={{
        '--theme-primary': currentTheme.colors.primary,
        '--theme-primary-dark': currentTheme.colors.primaryDark,
        '--theme-secondary': currentTheme.colors.secondary,
        '--theme-accent': currentTheme.colors.accent,
      } as React.CSSProperties}
    >
      {currentPage === 'home' && (
        <HomePage
          userStats={userStats}
          topInsight={mockAIInsights[0]}
          onOpenDeposit={() => setShowDepositModal(true)}
          theme={currentTheme}
        />
      )}

      {currentPage === 'zoo' && (
        <ZooPage
          animals={animals}
          userStats={userStats}
          onUnlockAnimal={handleUnlockAnimal}
          claimedCombos={claimedCombos}
          onClaimCombo={handleClaimCombo}
        />
      )}

      {currentPage === 'insights' && (
        <InsightsPage
          insights={mockAIInsights}
          spendingBreakdown={mockSpendingBreakdown}
          userStats={userStats}
          goal={mockGoal}
          transactions={transactions}
          onAddTransaction={() => setShowAddTransaction(true)}
        />
      )}

      {currentPage === 'profile' && (
        <ProfilePage
          userStats={userStats}
          goal={mockGoal}
          transactions={transactions}
          onAddTransaction={() => setShowAddTransaction(true)}
          currentTheme={theme}
          onThemeChange={setTheme}
        />
      )}

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="min-h-screen flex items-end sm:items-center justify-center">
              <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl">
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                >
                  ✕
                </button>
                <AddTransactionPage onAddTransaction={handleAddTransaction} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="min-h-screen flex items-end sm:items-center justify-center">
              <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl">
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />
                <h2 className="text-lg font-semibold">Deposit to savings</h2>
                <p className="mt-2 text-sm text-slate-300">How much do you want to deposit?</p>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={depositAmount}
                  onChange={(event) => setDepositAmount(event.target.value)}
                  placeholder="e.g. 100"
                  className="mt-4 w-full rounded-2xl border border-white/15 bg-slate-800 px-4 py-3 text-white outline-none focus:border-white/30"
                />
                <div className="mt-5 grid grid-cols-2 gap-2 pb-2">
                  <button
                    onClick={() => {
                      setShowDepositModal(false);
                      setDepositAmount('');
                    }}
                    className="rounded-2xl border border-white/20 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDepositSubmit}
                    className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4 pb-4">
        <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>

    </div>
  );
}