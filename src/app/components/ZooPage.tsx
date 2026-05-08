import { useEffect, useState } from 'react';
import { Lock, Coins, Trophy, Sparkles, Gift, CheckCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Map, X } from 'lucide-react';
import { Animal, UserStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { animalCombos, getComboProgress, Combo } from '../data/combos';
import { CelebrationModal } from './CelebrationModal';
import { AnimalUnlockCelebration } from './AnimalUnlockCelebration';
import { zooMaps, getAnimalsForMap } from '../data/maps';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface ZooPageProps {
  animals: Animal[];
  userStats: UserStats;
  onUnlockAnimal: (animalId: string) => void;
  claimedCombos?: string[];
  onClaimCombo?: (comboId: string) => void;
}

export function ZooPage({ animals, userStats, onUnlockAnimal, claimedCombos = [], onClaimCombo }: ZooPageProps) {
  const canUnlock = (animal: Animal): boolean => {
    if (animal.isUnlocked) return false;

    if (animal.unlockCondition.type === 'coins') {
      return userStats.coins >= animal.unlockCondition.value;
    }

    if (animal.unlockCondition.type === 'milestone') {
      return userStats.totalSavings >= animal.unlockCondition.value;
    }

    return false;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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

  const [activeTab, setActiveTab] = useState<'collection' | 'combos'>('collection');
  const [expandedMilestones, setExpandedMilestones] = useState(false);
  const [selectedMap, setSelectedMap] = useState('grassland');
  const [activeCollectionPanel, setActiveCollectionPanel] = useState<'milestone' | 'animals'>('milestone');
  const [showCombosModal, setShowCombosModal] = useState(false);
  const [showAnimalsModal, setShowAnimalsModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showSavingModal, setShowSavingModal] = useState(false);
  const [brokenMapImages, setBrokenMapImages] = useState<Record<string, boolean>>({});
  const [animalsModalToast, setAnimalsModalToast] = useState<{
    show: boolean;
    emoji: string;
    name: string;
  }>({ show: false, emoji: '', name: '' });

  const unlockedCount = animals.filter(a => a.isUnlocked).length;
  const unlockedAnimalIds = animals.filter(a => a.isUnlocked).map(a => a.id);

  // Get active combos (not zoo-master)
  const activeCombos = animalCombos.filter(c => c.id !== 'zoo-master');
  const zooMasterCombo = animalCombos.find(c => c.id === 'zoo-master');

  // Count ready combos
  const readyCombos = activeCombos.filter(combo => {
    const progress = getComboProgress(combo, unlockedAnimalIds);
    return progress.completed && !claimedCombos.includes(combo.id);
  }).length;

  const handleClaimCombo = (combo: Combo) => {
    onClaimCombo?.(combo.id);
    setCelebrationData({
      show: true,
      message: combo.description,
      reward: combo.reward.value,
      emoji: combo.emoji
    });
  };

  const handleUnlockAnimal = (animal: Animal) => {
    onUnlockAnimal(animal.id);
    setUnlockCelebration({
      show: true,
      emoji: animal.emoji,
      name: animal.name
    });
    if (showAnimalsModal) {
      setAnimalsModalToast({ show: true, emoji: animal.emoji, name: animal.name });
    }
  };

  useEffect(() => {
    if (!animalsModalToast.show) return;
    const t = window.setTimeout(() => setAnimalsModalToast((prev) => ({ ...prev, show: false })), 2600);
    return () => window.clearTimeout(t);
  }, [animalsModalToast.show]);

  const selectedMapIndex = Math.max(0, zooMaps.findIndex((m) => m.id === selectedMap));
  const handlePrevMap = () => {
    const prevIndex = (selectedMapIndex - 1 + zooMaps.length) % zooMaps.length;
    setSelectedMap(zooMaps[prevIndex].id);
  };
  const handleNextMap = () => {
    const nextIndex = (selectedMapIndex + 1) % zooMaps.length;
    setSelectedMap(zooMaps[nextIndex].id);
  };

  const isMapImageBroken = (mapId?: string) => (mapId ? !!brokenMapImages[mapId] : false);
  const markMapImageBroken = (mapId?: string) => {
    if (!mapId) return;
    setBrokenMapImages((prev) => (prev[mapId] ? prev : { ...prev, [mapId]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 pt-6 pb-4 rounded-b-2xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-lg font-bold">My Zoo</h1>
            <p className="text-blue-100 text-xs mt-0.5">
              {unlockedCount} of {animals.length} animals collected
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-1">
              <Coins className="w-4 h-4 text-yellow-300" />
              <span className="text-sm">{userStats.coins}</span>
            </div>
            <p className="text-[10px] text-blue-100">Coins</p>
          </div>
        </div>

        {/* Collection Progress */}
        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs">Collection</span>
            <span className="text-xs">{Math.round((unlockedCount / animals.length) * 100)}%</span>
          </div>
          <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-yellow-300 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / animals.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 mt-5">

        {/* Collection Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'collection' && (
            <motion.div
              key="collection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >


              {/* Big habitat stage */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMap}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="-mx-4 mt-3 mb-4 relative z-0"
                >
                  {(() => {
                    const currentMap = zooMaps.find(m => m.id === selectedMap);
                    const mapAnimals = getAnimalsForMap(selectedMap, animals);
                    const unlockedInMap = mapAnimals.filter(a => a.isUnlocked).length;
                    const completion = mapAnimals.length > 0 ? Math.round((unlockedInMap / mapAnimals.length) * 100) : 0;

                    return (
                      <div>
                        <div className="relative h-screen max-h-[90vh] overflow-hidden">
                          <div className="absolute inset-0">
                            {!isMapImageBroken(currentMap?.id) ? (
                              <img
                                src={currentMap?.imageUrl}
                                alt={currentMap?.name}
                                className="w-full h-full object-cover"
                                onError={() => markMapImageBroken(currentMap?.id)}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/55" />
                          </div>

                          {/* Side switch buttons */}
                          <button
                            onClick={handlePrevMap}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/70 shadow-md flex items-center justify-center text-gray-700"
                            aria-label="Previous habitat"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleNextMap}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/70 shadow-md flex items-center justify-center text-gray-700"
                            aria-label="Next habitat"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>

                          <div className="absolute inset-x-4 bottom-4 z-[70] space-y-2">
                            <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-3 shadow-2xl">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-600">
                                    Habitat
                                  </p>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {currentMap?.name ?? 'Habitat'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-slate-900/10 px-3 py-1 text-slate-900">
                                  <Coins className="w-4 h-4 text-yellow-500" />
                                  <span className="text-xs font-semibold">
                                    {userStats.coins}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-500">
                                <span>{unlockedInMap}/{mapAnimals.length} unlocked</span>
                                <span>{completion}% collected</span>
                              </div>
                              <div className="h-1 rounded-full bg-slate-200 overflow-hidden mt-2">
                                <div
                                  className="h-full bg-emerald-500"
                                  style={{ width: `${completion}%` }}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                              <motion.button
                                onClick={() => setActiveTab('collection')}
                                className={`flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white/90 py-2 px-2 text-[10px] font-semibold text-slate-800 transition-all ${
                                  activeTab === 'collection' ? 'ring-2 ring-emerald-300' : 'hover:bg-slate-100'
                                }`}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                              >
                                <span className="text-lg">🌾</span>
                                Farm
                              </motion.button>

                              <motion.button
                                onClick={() => setShowMilestoneModal(true)}
                                className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white/90 py-2 px-2 text-[10px] font-semibold text-slate-800 transition-all ${
                                  showMilestoneModal ? 'ring-2 ring-yellow-300' : 'hover:bg-slate-100'
                                }`}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                              >
                                <span className="text-lg">🏆</span>
                                Trophies
                                {readyCombos > 0 && (
                                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                                    {readyCombos}
                                  </span>
                                )}
                              </motion.button>

                              <motion.button
                                onClick={() => setShowSavingModal(true)}
                                className={`flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white/90 py-2 px-2 text-[10px] font-semibold text-slate-800 transition-all ${
                                  showSavingModal ? 'ring-2 ring-yellow-300' : 'hover:bg-slate-100'
                                }`}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                              >
                                <span className="text-lg">💰</span>
                                Savings
                              </motion.button>

                              <motion.button
                                onClick={() => setShowAnimalsModal(true)}
                                className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white/90 py-2 px-2 text-[10px] font-semibold text-slate-800 transition-all hover:bg-slate-100"
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                              >
                                <span className="text-lg">🐾</span>
                                Animals
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>

              {/* Milestone tracker moved to modal only */}


            </motion.div>
          )}

          {/* Combos Tab */}
          {activeTab === 'combos' && (
            <motion.div
              key="combos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Zoo Master Challenge - Featured */}
              {zooMasterCombo && (
                <motion.div
                  className={`bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-5 mb-4 shadow-lg ${
                    getComboProgress(zooMasterCombo, unlockedAnimalIds).completed
                      ? 'ring-4 ring-yellow-400'
                      : ''
                  }`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">{zooMasterCombo.emoji}</div>
                    <div className="flex-1">
                      <p className="text-lg mb-1">{zooMasterCombo.name}</p>
                      <p className="text-sm text-purple-100">{zooMasterCombo.description}</p>
                    </div>
                    <div className="text-center bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl">
                      <Trophy className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">+{zooMasterCombo.reward.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(unlockedCount / animals.length) * 100}%`
                        }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-sm">
                      {unlockedCount}/{animals.length}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Regular Combos */}
              <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-3">Combo Challenges</h3>
              <div className="grid grid-cols-1 gap-3 max-h-[450px] overflow-y-auto pr-1">
                {activeCombos.map((combo, index) => {
                  const progress = getComboProgress(combo, unlockedAnimalIds);
                  const isClaimed = claimedCombos.includes(combo.id);
                  const canClaim = progress.completed && !isClaimed;

                  return (
                    <motion.div
                      key={combo.id}
                      className={`bg-white rounded-xl p-4 border-2 ${
                        canClaim
                          ? 'border-yellow-400 ring-2 ring-yellow-200 shadow-lg'
                          : progress.completed
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{combo.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm text-gray-900">{combo.name}</p>
                            {progress.completed && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{combo.description}</p>

                          {/* Progress Bar */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${(progress.unlockedCount / progress.totalCount) * 100}%` }}
                                transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {progress.unlockedCount}/{progress.totalCount}
                            </span>
                          </div>
                        </div>

                        {/* Reward */}
                        <div className="text-right">
                          {canClaim ? (
                            <motion.button
                              onClick={() => handleClaimCombo(combo)}
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-2 rounded-lg text-xs shadow-md hover:shadow-lg active:scale-95 transition-all"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              Claim!
                            </motion.button>
                          ) : isClaimed ? (
                            <div className="text-xs text-green-600 bg-green-100 px-3 py-2 rounded-lg">
                              Claimed ✓
                            </div>
                          ) : (
                            <div className="text-center">
                              <Coins className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
                              <p className="text-xs text-yellow-700">+{combo.reward.value}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Tip */}
              <motion.div
                className="mt-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-900 mb-1">Maximize Rewards!</p>
                    <p className="text-xs text-yellow-700">Every animal unlocks multiple combo bonuses. Complete easier combos first to earn more coins!</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Combos Modal */}
      <Dialog open={showCombosModal} onOpenChange={setShowCombosModal}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] sm:max-w-lg p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-5 py-4">
            <DialogHeader className="text-left">
              <DialogTitle>Combos</DialogTitle>
              <DialogDescription className="text-yellow-50/90">
                完成组合挑战，领取额外金币奖励
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {activeCombos.map((combo, index) => {
                const progress = getComboProgress(combo, unlockedAnimalIds);
                const isClaimed = claimedCombos.includes(combo.id);
                const canClaim = progress.completed && !isClaimed;

                return (
                  <motion.div
                    key={combo.id}
                    className={`bg-white rounded-xl p-4 border-2 ${
                      canClaim
                        ? 'border-yellow-400 ring-2 ring-yellow-200 shadow-lg'
                        : progress.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{combo.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-gray-900">{combo.name}</p>
                          {progress.completed && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{combo.description}</p>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(progress.unlockedCount / progress.totalCount) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.05 }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {progress.unlockedCount}/{progress.totalCount}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {canClaim ? (
                          <motion.button
                            onClick={() => handleClaimCombo(combo)}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-2 rounded-lg text-xs shadow-md hover:shadow-lg active:scale-95 transition-all"
                            whileTap={{ scale: 0.95 }}
                          >
                            Claim
                          </motion.button>
                        ) : isClaimed ? (
                          <div className="text-xs text-green-600 bg-green-100 px-3 py-2 rounded-lg">
                            Claimed ✓
                          </div>
                        ) : (
                          <div className="text-center">
                            <Coins className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
                            <p className="text-xs text-yellow-700">+{combo.reward.value}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* My Animals Modal (same style as Combos) */}
      <Dialog open={showAnimalsModal} onOpenChange={setShowAnimalsModal}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] sm:max-w-lg p-0 overflow-hidden">
          {(() => {
            const ownedCount = animals.filter(a => a.isUnlocked).length;
            const unlockableCount = animals.filter(a => !a.isUnlocked && canUnlock(a)).length;
            return (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-4">
                  <DialogHeader className="text-left">
                    <DialogTitle>My Animals</DialogTitle>
                    <DialogDescription className="text-blue-50/90">
                      图鉴：浏览全部动物（{ownedCount}/{animals.length} 已拥有）
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="p-5 space-y-4">
                  {/* Unlock toast (inside modal, top) */}
                  <AnimatePresence>
                    {animalsModalToast.show && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl border border-emerald-200 shadow-md px-4 py-3 flex items-center justify-between gap-3"
                        role="status"
                        aria-live="polite"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl">
                            {animalsModalToast.emoji}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-900">Unlocked!</p>
                            <p className="text-xs text-emerald-700 truncate">
                              {animalsModalToast.name} joined your zoo!
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setAnimalsModalToast((prev) => ({ ...prev, show: false }))}
                          className="text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
                          aria-label="Close"
                        >
                          ×
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Global unlock hint (above the catalog) */}
                  {unlockableCount > 0 && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl px-4 py-3 text-sm">
                      你现在有 <span className="font-semibold">{unlockableCount}</span> 只动物可以解锁。直接点击对应卡片即可解锁。
                    </div>
                  )}

                  <div className="text-[11px] text-gray-500 uppercase tracking-wide">Animal Collection</div>
                  <div className="grid grid-cols-3 gap-3 max-h-[62vh] overflow-y-auto pr-1">
                    {animals.map((animal) => {
                      const locked = !animal.isUnlocked;
                      const unlockable = canUnlock(animal);
                      const showUnlockHint = locked && unlockable;

                      return (
                        <button
                          key={animal.id}
                          onClick={() => {
                            if (locked && unlockable) handleUnlockAnimal(animal);
                          }}
                          disabled={!showUnlockHint}
                          className={`relative text-left rounded-2xl border bg-white p-3 shadow-sm transition-all ${
                            locked
                              ? 'border-gray-200'
                              : 'border-emerald-200 ring-1 ring-emerald-100'
                          } ${showUnlockHint ? 'hover:shadow-md active:scale-[0.99]' : ''}`}
                        >
                          {/* top badges row */}
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              {/* per-card hint intentionally removed; use global hint above */}
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full border ${getRarityColor(animal.rarity)}`}>
                              {animal.rarity}
                            </span>
                          </div>

                          {/* icon */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2 ${
                            locked ? 'bg-gray-50 grayscale opacity-60' : 'bg-emerald-50'
                          }`}>
                            {animal.emoji}
                          </div>

                          {/* name */}
                          <p className="text-sm text-gray-900 mb-1 truncate">{animal.name}</p>

                          {/* status / cost line */}
                          {locked ? (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              {animal.unlockCondition.type === 'coins' ? (
                                <>
                                  <Coins className="w-3.5 h-3.5 text-yellow-600" />
                                  <span>{animal.unlockCondition.value}</span>
                                </>
                              ) : (
                                <>
                                  <Trophy className="w-3.5 h-3.5 text-purple-600" />
                                  <span>RM {animal.unlockCondition.value}</span>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Owned</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Celebration Modal */}
      <CelebrationModal
        show={celebrationData.show}
        message={celebrationData.message}
        reward={celebrationData.reward}
        emoji={celebrationData.emoji}
        onClose={() => setCelebrationData({ ...celebrationData, show: false })}
      />

      {/* Animal Unlock Celebration */}
      <AnimalUnlockCelebration
        show={unlockCelebration.show}
        animalEmoji={unlockCelebration.emoji}
        animalName={unlockCelebration.name}
        onClose={() => setUnlockCelebration({ ...unlockCelebration, show: false })}
      />

      {/* Milestone Modal - Bottom Sheet */}
      <AnimatePresence>
        {showMilestoneModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowMilestoneModal(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md rounded-t-3xl border-t border-white/30 shadow-2xl max-h-[80vh] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Milestone Unlocks</h2>
                  </div>
                  <button
                    onClick={() => setShowMilestoneModal(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Unlock animals by reaching savings milestones
                </p>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                  {[500, 1000, 1500, 2000].map((milestone) => {
                    const reached = userStats.totalSavings >= milestone;
                    const milestoneAnimal = animals.find(
                      a => a.unlockCondition.type === 'milestone' && a.unlockCondition.value === milestone
                    );
                    return (
                      <div key={milestone} className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      reached ? 'bg-purple-50' : 'bg-gray-100 grayscale opacity-60'
                    }`}>
                      {milestoneAnimal?.emoji || '🎁'}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${reached ? 'text-purple-900' : 'text-gray-500'}`}>
                        RM {milestone}
                      </p>
                      <p className={`text-xs ${reached ? 'text-purple-700' : 'text-gray-400'}`}>
                        {milestoneAnimal?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    reached ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {reached ? '✓ Unlocked' : 'Locked'}
                  </div>
                </div>
              );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Saving Modal - Bottom Sheet */}
      <AnimatePresence>
        {showSavingModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowSavingModal(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md rounded-t-3xl border-t border-white/30 shadow-2xl max-h-[60vh] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    <h2 className="text-lg font-semibold text-gray-900">Add Savings</h2>
                  </div>
                  <button
                    onClick={() => setShowSavingModal(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Track your savings progress and unlock new animals!
                    </p>
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-4 rounded-xl">
                      <p className="text-sm opacity-90">Current Savings</p>
                      <p className="text-2xl font-bold">RM {userStats.totalSavings}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 text-center">
                      Use the main app to add new savings transactions
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Animal Unlock Celebration */}
      <AnimalUnlockCelebration
        show={unlockCelebration.show}
        animalEmoji={unlockCelebration.emoji}
        animalName={unlockCelebration.name}
        onClose={() => setUnlockCelebration({ ...unlockCelebration, show: false })}
      />

    </div>
  );
}
