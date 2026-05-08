import { Home, Sparkles, Brain, User, QrCode } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'zoo', label: 'Zoo', icon: Sparkles },
    { id: 'scan', label: 'Scan QR', icon: QrCode, isScan: true },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="w-full rounded-2xl bg-slate-800/70 backdrop-blur-[1px] border border-slate-700/60">
      <div className="w-full">
        <div className="grid grid-cols-5 items-center gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            const isScan = item.isScan;

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  if (!isScan) onNavigate(item.id);
                }}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-3 text-center transition-colors ${
                  isActive
                    ? 'text-white/95'
                    : 'text-slate-300/80 hover:text-white/95'
                }`}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <div
                  className={isScan
                    ? 'flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-slate-700/80 shadow-lg'
                    : undefined}
                >
                  <IconComponent
                    className={`h-6 w-6 ${
                      isActive ? 'scale-110' : ''
                    } transition-transform`}
                  />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
