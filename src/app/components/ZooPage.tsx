import { useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { Animal, UserStats } from '../types';
import { CelebrationModal } from './CelebrationModal';
import { AnimalUnlockCelebration } from './AnimalUnlockCelebration';

interface ZooPageProps {
  animals: Animal[];
  userStats: UserStats;
  onUnlockAnimal: (animalId: string) => void;
}

export function ZooPage({ animals, userStats, onUnlockAnimal }: ZooPageProps) {
  const canUnlock = (animal: Animal): boolean => {
    if (animal.isUnlocked) return false;
    return animal.unlockCondition.type === 'milestone' && userStats.totalSavings >= animal.unlockCondition.value;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAnimalImage = (animalId: string) => `/img/${animalId}.jpg`;

  const [celebrationData, setCelebrationData] = useState<{
    show: boolean;
    message: string;
    reward: number;
    emoji: string;
  }>({
    show: false,
    message: '',
    reward: 0,
    emoji: ''
  });

  const [unlockCelebration, setUnlockCelebration] = useState<{
    show: boolean;
    emoji: string;
    name: string;
  }>({
    show: false,
    emoji: '',
    name: ''
  });

  const unlockedCount = animals.filter(a => a.isUnlocked).length;
  const savingTarget = 10000;
  const depositProgress = Math.min((userStats.totalSavings / savingTarget) * 100, 100);

  const handleUnlockAnimal = (animal: Animal) => {
    onUnlockAnimal(animal.id);
    setUnlockCelebration({
      show: true,
      emoji: animal.emoji,
      name: animal.name
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl">Hero Center</h1>
            <p className="text-blue-100 text-sm mt-1">
              {unlockedCount} of {animals.length} heroes recruited
            </p>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Saving Bar</span>
            <span className="text-sm">RM {userStats.totalSavings.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-500 mb-3">
            RM {userStats.totalSavings.toLocaleString()} saved of RM {savingTarget.toLocaleString()}
          </div>
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-yellow-300 rounded-full transition-all duration-500"
              style={{ width: `${depositProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 mt-5">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-semibold">My Heroes for Claiming</h2>
              <p className="text-sm text-gray-500 mt-1">Only these three heroes can be claimed by savings milestones.</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>{animals.length - unlockedCount} animals remaining</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {animals.map((animal) => {
              const locked = !animal.isUnlocked;
              const unlockable = canUnlock(animal);

              return (
                <div
                  key={animal.id}
                  className="rounded-3xl border border-gray-200 p-4 shadow-sm bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-20 h-20 rounded-3xl overflow-hidden border ${locked ? 'border-gray-200 bg-gray-100' : 'border-emerald-200 bg-emerald-50'}`}>
                        <img
                          src={getAnimalImage(animal.id)}
                          alt={animal.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{animal.name}</p>
                        <span className={`inline-flex items-center px-2 py-1 mt-1 rounded-full text-[10px] font-semibold ${getRarityColor(animal.rarity)}`}>
                          {animal.rarity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {locked ? (
                        unlockable ? (
                          <button
                            onClick={() => handleUnlockAnimal(animal)}
                            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                          >
                            Unlock
                          </button>
                        ) : (
                          <div className="text-xs text-gray-500">Locked</div>
                        )
                      ) : (
                        <div className="text-xs font-semibold text-emerald-700">Owned</div>
                      )}
                    </div>
                  </div>

                  {locked && (
                    <div className="mt-3 p-3 rounded-2xl bg-white border border-gray-100 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-purple-600" />
                        Requires RM {animal.unlockCondition.value} total savings
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-4 border border-blue-100 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Simple Zoo View</p>
              <p className="text-xs text-blue-700">This page now focuses on the progress bar and the animal claim list only.</p>
            </div>
          </div>
        </div>
      </div>

      <CelebrationModal
        show={celebrationData.show}
        message={celebrationData.message}
        reward={celebrationData.reward}
        emoji={celebrationData.emoji}
        onClose={() => setCelebrationData({ ...celebrationData, show: false })}
      />

      <AnimalUnlockCelebration
        show={unlockCelebration.show}
        animalEmoji={unlockCelebration.emoji}
        animalName={unlockCelebration.name}
        onClose={() => setUnlockCelebration({ ...unlockCelebration, show: false })}
      />
    </div>
  );
}
