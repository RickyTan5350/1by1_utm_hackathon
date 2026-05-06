export interface Combo {
  id: string;
  name: string;
  description: string;
  animalIds: string[];
  reward: {
    type: 'coins' | 'multiplier';
    value: number;
  };
  emoji: string;
}

export const animalCombos: Combo[] = [
  {
    id: 'farm-basics',
    name: 'Farm Basics',
    description: 'Start your farm collection',
    animalIds: ['1', '2', '3'], // Sheep, Cow, Chicken
    reward: { type: 'coins', value: 50 },
    emoji: '🌾'
  },
  {
    id: 'farm-complete',
    name: 'Complete Farm',
    description: 'All farm animals together',
    animalIds: ['1', '2', '3', '4'], // Sheep, Cow, Chicken, Pig
    reward: { type: 'coins', value: 100 },
    emoji: '🚜'
  },
  {
    id: 'speedy-squad',
    name: 'Speedy Squad',
    description: 'Fast and furious animals',
    animalIds: ['5', '9', '10'], // Horse, Rabbit, Fox
    reward: { type: 'coins', value: 80 },
    emoji: '⚡'
  },
  {
    id: 'rare-collection',
    name: 'Rare Collection',
    description: 'Exclusive rare animals',
    animalIds: ['6', '8', '10'], // Panda, Elephant, Fox
    reward: { type: 'coins', value: 120 },
    emoji: '💎'
  },
  {
    id: 'arctic-friends',
    name: 'Arctic Friends',
    description: 'Cold weather companions',
    animalIds: ['6', '11', '12'], // Panda, Bear, Penguin
    reward: { type: 'coins', value: 150 },
    emoji: '❄️'
  },
  {
    id: 'mighty-beasts',
    name: 'Mighty Beasts',
    description: 'The most powerful animals',
    animalIds: ['7', '8', '11'], // Lion, Elephant, Bear
    reward: { type: 'coins', value: 200 },
    emoji: '👑'
  },
  {
    id: 'small-wonders',
    name: 'Small Wonders',
    description: 'Adorable little creatures',
    animalIds: ['1', '3', '9', '12'], // Sheep, Chicken, Rabbit, Penguin
    reward: { type: 'coins', value: 75 },
    emoji: '🌟'
  },
  {
    id: 'wild-hunters',
    name: 'Wild Hunters',
    description: 'Natural predators united',
    animalIds: ['7', '10', '11'], // Lion, Fox, Bear
    reward: { type: 'coins', value: 130 },
    emoji: '🎯'
  },
  {
    id: 'gentle-giants',
    name: 'Gentle Giants',
    description: 'Big but friendly',
    animalIds: ['2', '5', '8'], // Cow, Horse, Elephant
    reward: { type: 'coins', value: 90 },
    emoji: '🌿'
  },
  {
    id: 'zoo-master',
    name: 'Zoo Master',
    description: 'Collect all animals!',
    animalIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    reward: { type: 'coins', value: 500 },
    emoji: '🏆'
  }
];

export function getComboProgress(combo: Combo, unlockedAnimalIds: string[]): {
  completed: boolean;
  unlockedCount: number;
  totalCount: number;
  missingAnimals: string[];
} {
  const unlockedInCombo = combo.animalIds.filter(id => unlockedAnimalIds.includes(id));
  const completed = unlockedInCombo.length === combo.animalIds.length;

  return {
    completed,
    unlockedCount: unlockedInCombo.length,
    totalCount: combo.animalIds.length,
    missingAnimals: combo.animalIds.filter(id => !unlockedAnimalIds.includes(id))
  };
}
