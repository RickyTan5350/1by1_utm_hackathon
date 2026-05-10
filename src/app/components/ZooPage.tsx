import { useState } from 'react';
import { Sparkles, Trophy, Shield, Star, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-slate-400 to-slate-500 shadow-slate-200/50';
      case 'rare': return 'from-blue-400 to-indigo-600 shadow-blue-300/50';
      case 'epic': return 'from-purple-500 to-fuchsia-600 shadow-purple-400/50';
      default: return 'from-slate-400 to-slate-500';
    }
  };

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
  const nextTarget = animals.find(a => !a.isUnlocked)?.unlockCondition.value ?? 10000;
  const progress = Math.min((userStats.totalSavings / nextTarget) * 100, 100);

  const handleUnlockAnimal = (animal: Animal) => {
    onUnlockAnimal(animal.id);
    setUnlockCelebration({
      show: true,
      emoji: animal.emoji,
      name: animal.name
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-32 relative">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 pt-16 pb-12 rounded-b-[3rem] shadow-lg relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 relative z-10"
        >
          <div>
            <h1 className="text-3xl font-bold">Hero Collection</h1>
            <p className="text-blue-100 text-sm mt-1">
              {unlockedCount} of {animals.length} legends recruited
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <Trophy className="w-6 h-6 text-yellow-300 shadow-sm" />
          </div>
        </motion.div>

        {/* Progress Bar Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] p-6 shadow-xl border border-blue-100 relative z-10"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Savings</p>
              <h2 className="text-2xl font-bold text-gray-900">
                RM {userStats.totalSavings.toLocaleString()}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-1">Progress</p>
              <h2 className="text-xl font-bold text-gray-900">{Math.round(progress)}%</h2>
            </div>
          </div>

          <div className="relative h-3.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.3)]"
            />
          </div>
          
          <p className="text-gray-500 text-xs mt-4 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            {progress >= 100 
              ? "New hero ready to be claimed!" 
              : `RM ${(nextTarget - userStats.totalSavings).toLocaleString()} more to next milestone`}
          </p>
        </motion.div>
      </div>

      {/* Hero List Section */}
      <div className="px-6 mt-8 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-lg font-semibold text-gray-800">Available Heroes</h2>
          <Star className="w-5 h-5 text-amber-400/50" />
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {animals.map((animal, index) => {
            const locked = !animal.isUnlocked;
            const unlockable = canUnlock(animal);

            return (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`group relative rounded-[2rem] p-4 border transition-all duration-300 ${
                  locked 
                    ? 'bg-white border-gray-100 shadow-sm' 
                    : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-transform duration-300 group-hover:scale-105 ${
                        locked ? 'border-gray-100 grayscale' : 'border-emerald-200'
                      }`}>
                        <img
                          src={`/img/${animal.id}.jpg`}
                          alt={animal.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {locked && !unlockable && (
                        <div className="absolute inset-0 bg-white/40 flex items-center justify-center rounded-2xl">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className={`font-bold ${locked ? 'text-gray-500' : 'text-gray-900'}`}>
                        {animal.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-sm bg-gradient-to-r ${getRarityStyles(animal.rarity)}`}>
                          {animal.rarity}
                        </span>
                        {locked && (
                          <span className="text-[9px] font-medium text-gray-400 flex items-center gap-1">
                            Target: RM {animal.unlockCondition.value}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {locked ? (
                      unlockable ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnlockAnimal(animal)}
                          className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                        >
                          Claim
                        </motion.button>
                      ) : (
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1 rounded-lg bg-gray-50 border border-gray-100">
                          Locked
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-end">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                          <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                        </div>
                        <span className="text-[9px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">Owned</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {unlockCelebration.show && (
          <AnimalUnlockCelebration
            show={unlockCelebration.show}
            animalEmoji={unlockCelebration.emoji}
            animalName={unlockCelebration.name}
            onClose={() => setUnlockCelebration({ ...unlockCelebration, show: false })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

