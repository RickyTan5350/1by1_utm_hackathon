import { Home, Sparkles, Brain, User, QrCode } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'zoo', label: 'Heroes', icon: Sparkles },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="max-w-md mx-auto px-4 pb-4 relative">
        <div className="rounded-[2rem] bg-blue-50 border border-blue-200 shadow-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-2 p-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-blue-50'
                  }`}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <IconComponent
                    className={`w-6 h-6 mb-1 ${
                      isActive ? 'scale-110' : ''
                    } transition-transform`}
                  />
                  <span className="text-[10px] leading-none">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <button
          className="absolute left-1/2 -top-5 -translate-x-1/2 h-14 w-14 rounded-full bg-blue-600 text-white shadow-2xl border-4 border-white grid place-items-center"
          aria-label="Scan QR"
        >
          <QrCode className="w-7 h-7" />
        </button>
      </div>
    </nav>
  );
}
