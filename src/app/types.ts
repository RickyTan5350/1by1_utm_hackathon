export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl: string;
  estimatedDays: number;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'deposit' | 'fixedDeposit' | 'transfer';
  amount: number;
  category: string;
  recipient?: string;
  date: string;
  description?: string;
}

export interface Animal {
  id: string;
  name: string;
  emoji: string;
  unlockCondition: {
    type: 'coins' | 'milestone';
    value: number;
  };
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic';
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'achievement';
  category: string;
  message: string;
  actionable: string;
  icon: string;
}

export interface UserStats {
  totalSavings: number;
  totalSpending: number;
  coins: number;
  streak: number;
  animalsCollected: number;
  walletBalance: number;
  fixedDepositBalance: number;
}

export interface SpendingBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}
