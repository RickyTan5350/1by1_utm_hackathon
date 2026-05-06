import { Home, Sparkles, Brain, User } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'zoo', label: 'Zoo', icon: Sparkles },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <IconComponent
                  className={`w-6 h-6 mb-1 ${
                    isActive ? 'scale-110' : ''
                  } transition-transform`}
                />
                <span className="text-xs">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
