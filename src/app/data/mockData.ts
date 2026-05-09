import { Goal, Transaction, Animal, AIInsight, UserStats, SpendingBreakdown } from '../types';

export const mockGoal: Goal = {
  id: '1',
  name: 'Buy MacBook Pro',
  targetAmount: 5000,
  currentAmount: 2340,
  imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
  estimatedDays: 45
};

export const mockTransactions: Transaction[] = [
  { id: '1', type: 'expense', amount: 25.50, category: 'Food', date: '2026-05-05', description: 'Lunch at cafe' },
  { id: '2', type: 'deposit', amount: 200, category: 'Deposit', date: '2026-05-05' },
  { id: '3', type: 'expense', amount: 80, category: 'Shopping', date: '2026-05-04', description: 'New shoes' },
  { id: '4', type: 'expense', amount: 15, category: 'Entertainment', date: '2026-05-04', description: 'Movie ticket' },
  { id: '5', type: 'expense', amount: 45.80, category: 'Food', date: '2026-05-03', description: 'Groceries' },
  { id: '6', type: 'fixedDeposit', amount: 150, category: 'Fixed Deposit', date: '2026-05-03' },
];

export const mockAnimals: Animal[] = [
  { id: 'cat1', name: 'Nova', emoji: '🌟', unlockCondition: { type: 'milestone', value: 2500 }, isUnlocked: false, rarity: 'common' },
  { id: 'cat2', name: 'Blaze', emoji: '🔥', unlockCondition: { type: 'milestone', value: 5000 }, isUnlocked: false, rarity: 'rare' },
  { id: 'cat3', name: 'Shadow', emoji: '🌙', unlockCondition: { type: 'milestone', value: 10000 }, isUnlocked: false, rarity: 'epic' },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'warning',
    category: 'Food',
    message: 'Food spending is 40% above your average',
    actionable: 'Try meal prepping 2-3 times per week to reduce dining out costs',
    icon: 'alert-circle'
  },
  {
    id: '2',
    type: 'suggestion',
    category: 'Savings',
    message: 'You can reach your goal 12 days faster',
    actionable: 'Save an additional RM50 per week by reducing entertainment expenses',
    icon: 'trending-up'
  },
  {
    id: '3',
    type: 'achievement',
    category: 'Streak',
    message: '7-day login streak! Keep it up!',
    actionable: 'Continue daily tracking to earn +7 bonus coins',
    icon: 'award'
  },
  {
    id: '4',
    type: 'suggestion',
    category: 'Shopping',
    message: 'Shopping category exceeded budget',
    actionable: 'Set a weekly limit of RM100 for non-essential purchases',
    icon: 'shopping-bag'
  },
];

export const mockUserStats: UserStats = {
  totalSavings: 2500,
  totalSpending: 856.30,
  coins: 0,
  streak: 7,
  animalsCollected: 0,
  walletBalance: 1140,
  fixedDepositBalance: 1200
};

export const mockSpendingBreakdown: SpendingBreakdown[] = [
  { category: 'Food', amount: 386.30, percentage: 45, color: '#10b981' },
  { category: 'Shopping', amount: 280, percentage: 33, color: '#3b82f6' },
  { category: 'Entertainment', amount: 120, percentage: 14, color: '#f59e0b' },
  { category: 'Transport', amount: 70, percentage: 8, color: '#8b5cf6' },
];
