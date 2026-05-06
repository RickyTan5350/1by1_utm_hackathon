export interface ColorTheme {
  id: string;
  name: string;
  emoji: string;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
    gradient: {
      from: string;
      to: string;
    };
  };
}

export const colorThemes: ColorTheme[] = [
  {
    id: 'emerald',
    name: 'Fresh Emerald',
    emoji: '🌿',
    colors: {
      primary: 'rgb(16, 185, 129)', // emerald-500
      primaryDark: 'rgb(5, 150, 105)', // emerald-600
      secondary: 'rgb(6, 182, 212)', // cyan-500
      accent: 'rgb(251, 191, 36)', // amber-400
      success: 'rgb(34, 197, 94)', // green-500
      warning: 'rgb(251, 146, 60)', // orange-400
      danger: 'rgb(239, 68, 68)', // red-500
      gradient: {
        from: 'from-emerald-500',
        to: 'to-emerald-600'
      }
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    emoji: '🌊',
    colors: {
      primary: 'rgb(59, 130, 246)', // blue-500
      primaryDark: 'rgb(37, 99, 235)', // blue-600
      secondary: 'rgb(14, 165, 233)', // sky-500
      accent: 'rgb(251, 191, 36)', // amber-400
      success: 'rgb(34, 197, 94)', // green-500
      warning: 'rgb(251, 146, 60)', // orange-400
      danger: 'rgb(239, 68, 68)', // red-500
      gradient: {
        from: 'from-blue-500',
        to: 'to-blue-600'
      }
    }
  },
  {
    id: 'sunset',
    name: 'Warm Sunset',
    emoji: '🌅',
    colors: {
      primary: 'rgb(249, 115, 22)', // orange-500
      primaryDark: 'rgb(234, 88, 12)', // orange-600
      secondary: 'rgb(251, 146, 60)', // orange-400
      accent: 'rgb(252, 211, 77)', // amber-300
      success: 'rgb(34, 197, 94)', // green-500
      warning: 'rgb(251, 191, 36)', // amber-400
      danger: 'rgb(239, 68, 68)', // red-500
      gradient: {
        from: 'from-orange-500',
        to: 'to-pink-500'
      }
    }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    emoji: '💜',
    colors: {
      primary: 'rgb(168, 85, 247)', // purple-500
      primaryDark: 'rgb(147, 51, 234)', // purple-600
      secondary: 'rgb(192, 132, 252)', // purple-400
      accent: 'rgb(251, 191, 36)', // amber-400
      success: 'rgb(34, 197, 94)', // green-500
      warning: 'rgb(251, 146, 60)', // orange-400
      danger: 'rgb(239, 68, 68)', // red-500
      gradient: {
        from: 'from-purple-500',
        to: 'to-purple-600'
      }
    }
  },
  {
    id: 'rose',
    name: 'Sweet Rose',
    emoji: '🌹',
    colors: {
      primary: 'rgb(244, 63, 94)', // rose-500
      primaryDark: 'rgb(225, 29, 72)', // rose-600
      secondary: 'rgb(251, 113, 133)', // rose-400
      accent: 'rgb(251, 191, 36)', // amber-400
      success: 'rgb(34, 197, 94)', // green-500
      warning: 'rgb(251, 146, 60)', // orange-400
      danger: 'rgb(239, 68, 68)', // red-500
      gradient: {
        from: 'from-rose-500',
        to: 'to-pink-500'
      }
    }
  },
  {
    id: 'teal',
    name: 'Cool Teal',
    emoji: '🧊',
    colors: {
      primary: 'rgb(20, 184, 166)', // teal-500
      primaryDark: 'rgb(13, 148, 136)', // teal-600
      secondary: 'rgb(45, 212, 191)', // teal-400
      accent: 'rgb(251, 191, 36)', // amber-400
      success: 'rgb(34, 197, 94)', // green-500
      warning: 'rgb(251, 146, 60)', // orange-400
      danger: 'rgb(239, 68, 68)', // red-500
      gradient: {
        from: 'from-teal-500',
        to: 'to-cyan-500'
      }
    }
  }
];

export function getTheme(themeId: string): ColorTheme {
  return colorThemes.find(t => t.id === themeId) || colorThemes[0];
}
