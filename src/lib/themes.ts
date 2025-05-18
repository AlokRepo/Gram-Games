import type { LucideIcon } from 'lucide-react';
import { CloudSun, Waves, Sparkles, Trees, Palette } from 'lucide-react';

export interface ThemeOption {
  name: string;
  id: 'sky' | 'underwater' | 'space' | 'forest' | 'rainbow';
  backgroundClasses: string;
  bubbleColors: string[];
  icon: LucideIcon;
  unlockScore: number;
}

export const THEMES: ThemeOption[] = [
  {
    name: 'Sky High',
    id: 'sky',
    backgroundClasses: 'bg-gradient-to-b from-sky-300 via-sky-400 to-blue-500',
    bubbleColors: ['rgba(255, 255, 255, 0.7)', 'rgba(173, 216, 230, 0.7)', 'rgba(135, 206, 250, 0.7)'], // Light blues, white
    icon: CloudSun,
    unlockScore: 0,
  },
  {
    name: 'Deep Dive',
    id: 'underwater',
    backgroundClasses: 'bg-gradient-to-b from-cyan-500 via-teal-600 to-blue-700',
    bubbleColors: ['rgba(0, 255, 255, 0.7)', 'rgba(72, 209, 204, 0.7)', 'rgba(64, 224, 208, 0.7)'], // Aquas, teals
    icon: Waves,
    unlockScore: 50,
  },
  {
    name: 'Cosmic Float',
    id: 'space',
    backgroundClasses: 'bg-gradient-to-b from-indigo-800 via-purple-800 to-slate-900',
    bubbleColors: ['rgba(224, 170, 255, 0.7)', 'rgba(180, 180, 255, 0.7)', 'rgba(255, 255, 255, 0.6)'], // Purples, dark blues, white
    icon: Sparkles,
    unlockScore: 150,
  },
  {
    name: 'Forest Whisper',
    id: 'forest',
    backgroundClasses: 'bg-gradient-to-b from-green-500 via-emerald-600 to-lime-700',
    bubbleColors: ['rgba(144, 238, 144, 0.7)', 'rgba(60, 179, 113, 0.7)', 'rgba(240, 255, 240, 0.7)'], // Greens, light yellow-green
    icon: Trees,
    unlockScore: 300,
  },
  {
    name: 'Rainbow Pop',
    id: 'rainbow',
    backgroundClasses: 'bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 animate-pulse',
    bubbleColors: [
        'rgba(255, 99, 71, 0.7)',  // Tomato
        'rgba(255, 165, 0, 0.7)', // Orange
        'rgba(255, 255, 0, 0.7)', // Yellow
        'rgba(50, 205, 50, 0.7)', // LimeGreen
        'rgba(30, 144, 255, 0.7)',// DodgerBlue
        'rgba(138, 43, 226, 0.7)' // BlueViolet
    ],
    icon: Palette,
    unlockScore: 500,
  }
];

export const DEFAULT_THEME_ID: ThemeOption['id'] = 'sky';

export const getThemeById = (id: ThemeOption['id']): ThemeOption | undefined => {
  return THEMES.find(theme => theme.id === id);
};
