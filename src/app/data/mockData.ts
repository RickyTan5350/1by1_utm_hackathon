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
  { id: '2', type: 'saving', amount: 200, category: 'Savings', date: '2026-05-05' },
  { id: '3', type: 'expense', amount: 80, category: 'Shopping', date: '2026-05-04', description: 'New shoes' },
  { id: '4', type: 'expense', amount: 15, category: 'Entertainment', date: '2026-05-04', description: 'Movie ticket' },
  { id: '5', type: 'expense', amount: 45.80, category: 'Food', date: '2026-05-03', description: 'Groceries' },
  { id: '6', type: 'saving', amount: 150, category: 'Savings', date: '2026-05-03' },
];

export const mockAnimals: Animal[] = [
  { id: '1', name: 'Sheep', emoji: '🐑', unlockCondition: { type: 'coins', value: 50 }, isUnlocked: true, rarity: 'common' },
  { id: '2', name: 'Cow', emoji: '🐄', unlockCondition: { type: 'coins', value: 100 }, isUnlocked: true, rarity: 'common' },
  { id: '3', name: 'Chicken', emoji: '🐔', unlockCondition: { type: 'coins', value: 80 }, isUnlocked: true, rarity: 'common' },
  { id: '4', name: 'Pig', emoji: '🐷', unlockCondition: { type: 'coins', value: 120 }, isUnlocked: false, rarity: 'common' },
  { id: '5', name: 'Horse', emoji: '🐴', unlockCondition: { type: 'milestone', value: 500 }, isUnlocked: false, rarity: 'rare' },
  { id: '6', name: 'Panda', emoji: '🐼', unlockCondition: { type: 'milestone', value: 1000 }, isUnlocked: false, rarity: 'rare' },
  { id: '7', name: 'Lion', emoji: '🦁', unlockCondition: { type: 'milestone', value: 2000 }, isUnlocked: false, rarity: 'epic' },
  { id: '8', name: 'Elephant', emoji: '🐘', unlockCondition: { type: 'coins', value: 200 }, isUnlocked: false, rarity: 'rare' },
  { id: '9', name: 'Rabbit', emoji: '🐰', unlockCondition: { type: 'coins', value: 60 }, isUnlocked: false, rarity: 'common' },
  { id: '10', name: 'Fox', emoji: '🦊', unlockCondition: { type: 'coins', value: 150 }, isUnlocked: false, rarity: 'rare' },
  { id: '11', name: 'Bear', emoji: '🐻', unlockCondition: { type: 'milestone', value: 1500 }, isUnlocked: false, rarity: 'epic' },
  { id: '12', name: 'Penguin', emoji: '🐧', unlockCondition: { type: 'coins', value: 90 }, isUnlocked: false, rarity: 'common' },
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
  totalSavings: 2340,
  totalSpending: 856.30,
  coins: 245,
  streak: 7,
  animalsCollected: 3
};

export const mockSpendingBreakdown: SpendingBreakdown[] = [
  { category: 'Food', amount: 386.30, percentage: 45, color: '#10b981' },
  { category: 'Shopping', amount: 280, percentage: 33, color: '#3b82f6' },
  { category: 'Entertainment', amount: 120, percentage: 14, color: '#f59e0b' },
  { category: 'Transport', amount: 70, percentage: 8, color: '#8b5cf6' },
];
