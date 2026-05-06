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
  const [theme, setTheme] = useState('emerald');

  const handleAddTransaction = (newTransaction: {
    type: 'expense' | 'saving';
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

    // Update user stats
    if (newTransaction.type === 'saving') {
      const coinsEarned = Math.floor(newTransaction.amount * 10);
      setUserStats({
        ...userStats,
        totalSavings: userStats.totalSavings + newTransaction.amount,
        coins: userStats.coins + coinsEarned,
      });

      // Update goal progress
      mockGoal.currentAmount += newTransaction.amount;

      // Check milestone unlocks
      const milestoneAnimals = animals.map(animal => {
        if (
          animal.unlockCondition.type === 'milestone' &&
          animal.unlockCondition.value <= userStats.totalSavings + newTransaction.amount &&
          !animal.isUnlocked
        ) {
          return { ...animal, isUnlocked: true };
        }
        return animal;
      });
      setAnimals(milestoneAnimals);
    } else {
      setUserStats({
        ...userStats,
        totalSpending: userStats.totalSpending + newTransaction.amount,
      });
    }

    // Close modal and navigate to home
    setShowAddTransaction(false);
    setTimeout(() => setCurrentPage('home'), 500);
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
          userStats={userStats}
          topInsight={mockAIInsights[0]}
          onNavigateToAdd={() => setShowAddTransaction(true)}
          onCheckIn={handleCheckIn}
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

      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}