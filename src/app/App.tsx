import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ZooPage } from './components/ZooPage';
import { InsightsPage } from './components/InsightsPage';
import { AddTransactionPage } from './components/AddTransactionPage';
import { AddDepositPage } from './components/AddDepositPage.tsx';
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
import { getTheme } from './data/themes';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showAddDeposit, setShowAddDeposit] = useState(false);
  const [theme, setTheme] = useState('emerald');

  const handleAddTransaction = (newTransaction: {
    type: 'expense' | 'transfer';
    amount: number;
    category: string;
    recipient?: string;
    description: string;
  }) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: newTransaction.amount,
      category: newTransaction.type === 'transfer' ? newTransaction.recipient ?? 'Transfer' : newTransaction.category,
      recipient: newTransaction.recipient,
      date: new Date().toISOString().split('T')[0],
      description: newTransaction.description,
    };

    setTransactions([transaction, ...transactions]);

    const nextStats = { ...userStats };
    nextStats.totalSpending += newTransaction.amount;
    nextStats.walletBalance = Math.max(0, nextStats.walletBalance - newTransaction.amount);

    setUserStats(nextStats);
    setShowSendMoney(false);
    setTimeout(() => setCurrentPage('home'), 500);
  };

  const handleAddDeposit = (newTransaction: {
    type: 'deposit' | 'fixedDeposit';
    amount: number;
    category: string;
    description: string;
  }) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: newTransaction.amount,
      category: newTransaction.category,
      date: new Date().toISOString().split('T')[0],
      description: newTransaction.description,
    };

    setTransactions([transaction, ...transactions]);

    const nextStats = { ...userStats };
    nextStats.totalSavings += newTransaction.amount;
    if (newTransaction.type === 'deposit') {
      nextStats.walletBalance += newTransaction.amount;
    } else {
      nextStats.fixedDepositBalance += newTransaction.amount;
    }
    mockGoal.currentAmount += newTransaction.amount;

    setUserStats(nextStats);

    const milestoneAnimals = animals.map(animal => {
      if (
        animal.unlockCondition.type === 'milestone' &&
        animal.unlockCondition.value <= nextStats.totalSavings &&
        !animal.isUnlocked
      ) {
        return { ...animal, isUnlocked: true };
      }
      return animal;
    });
    setAnimals(milestoneAnimals);

    setShowAddDeposit(false);
    setTimeout(() => setCurrentPage('home'), 500);
  };

  const handleCheckIn = () => {
    setUserStats({
      ...userStats,
      streak: userStats.streak + 1,
    });
  };

  const handleUnlockAnimal = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;

    if (
      animal.unlockCondition.type === 'milestone' &&
      userStats.totalSavings >= animal.unlockCondition.value
    ) {
      setAnimals(animals.map(a =>
        a.id === animalId ? { ...a, isUnlocked: true } : a
      ));
      setUserStats({
        ...userStats,
        animalsCollected: userStats.animalsCollected + 1,
      });
    }
  };



  const currentTheme = getTheme(theme);

  return (
    <div
      className="max-w-md mx-auto bg-white min-h-screen relative"
      style={{
        '--theme-primary': currentTheme.colors.primary,
        '--theme-primary-dark': currentTheme.colors.primaryDark,
        '--theme-secondary': currentTheme.colors.secondary,
        '--theme-accent': currentTheme.colors.accent,
      } as React.CSSProperties}
    >
      {currentPage === 'home' && (
        <HomePage
          goal={mockGoal}
          animals={animals}
          userStats={userStats}
          topInsight={mockAIInsights[0]}
          onNavigateToDeposit={() => setShowAddDeposit(true)}
          onNavigateToTransaction={() => setShowSendMoney(true)}
          onCheckIn={handleCheckIn}
          theme={currentTheme}
        />
      )}

      {currentPage === 'zoo' && (
        <ZooPage
          animals={animals}
          userStats={userStats}
          onUnlockAnimal={handleUnlockAnimal}
        />
      )}

      {currentPage === 'insights' && (
        <InsightsPage
          insights={mockAIInsights}
          spendingBreakdown={mockSpendingBreakdown}
          userStats={userStats}
          goal={mockGoal}
          transactions={transactions}
          onAddTransaction={() => setShowSendMoney(true)}
        />
      )}

      {currentPage === 'profile' && (
        <ProfilePage
          userStats={userStats}
          goal={mockGoal}
          transactions={transactions}
          onAddTransaction={() => setShowSendMoney(true)}
          currentTheme={theme}
          onThemeChange={setTheme}
        />
      )}

      {/* Send Money Modal */}
      {showSendMoney && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="min-h-screen flex items-end sm:items-center justify-center">
              <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl">
                <button
                  onClick={() => setShowSendMoney(false)}
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

      {showAddDeposit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="min-h-screen flex items-end sm:items-center justify-center">
              <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl">
                <button
                  onClick={() => setShowAddDeposit(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                >
                  ✕
                </button>
                <AddDepositPage goal={mockGoal} onAddDeposit={handleAddDeposit} />
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}