import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { colorThemes, ColorTheme } from '../data/themes';

interface ThemeSwitcherProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        whileTap={{ scale: 0.9 }}
      >
        <Palette className="w-5 h-5 text-white" />
      </motion.button>

      {/* Theme Selector Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Panel */}
            <motion.div
              className="fixed bottom-20 left-0 right-0 z-50 px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-gray-900">Choose Theme</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {colorThemes.map((theme) => {
                    const isActive = currentTheme === theme.id;
                    return (
                      <motion.button
                        key={theme.id}
                        onClick={() => {
                          onThemeChange(theme.id);
                          setIsOpen(false);
                        }}
                        className={`relative rounded-xl p-4 border-2 transition-all ${
                          isActive
                            ? 'border-gray-900 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Theme Preview */}
                        <div className="mb-3">
                          <div
                            className="h-12 rounded-lg mb-2"
                            style={{
                              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`
                            }}
                          />
                          <div className="flex gap-1">
                            <div
                              className="h-2 flex-1 rounded"
                              style={{ backgroundColor: theme.colors.secondary }}
                            />
                            <div
                              className="h-2 flex-1 rounded"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                          </div>
                        </div>

                        {/* Theme Info */}
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{theme.emoji}</span>
                          <div className="flex-1 text-left">
                            <p className="text-sm text-gray-900">{theme.name}</p>
                          </div>
                        </div>

                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
