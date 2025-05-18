
'use client';
import type { LucideIcon } from 'lucide-react';
import { Droplets, CloudDrizzle, Wind, VolumeX, Brain, Snowflake, Palette } from 'lucide-react'; // Added Brain for platform icon, Snowflake for Melt Away

export interface GameMeta {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  icon: LucideIcon;
  route: string;
  color?: string; // For GameCard theming hints
  dataAiHint?: string; // For placeholder image search
}

export const PLATFORM_GAMES: GameMeta[] = [
  {
    id: 'bubble-popper',
    name: 'Bubble Popper',
    description: 'Pop bubbles until your mind floats away.',
    longDescription: 'A classic and calming game. Click or tap on the bubbles to pop them. Different types of bubbles offer different points. Unlock new themes as you reach higher scores!',
    icon: Droplets,
    route: '/games/bubble-popper',
    color: 'bg-sky-100 dark:bg-sky-800',
    dataAiHint: 'bubbles water',
  },
  {
    id: 'melt-away',
    name: 'Melt Away',
    description: 'Gently melt away sculptures to find peace.',
    longDescription: 'Drag your finger or mouse across the sculpture to watch it slowly melt and disappear. A soothing experience designed for relaxation.',
    icon: Snowflake, // Using Snowflake for now, can be themed later
    route: '/games/melt-away',
    color: 'bg-blue-100 dark:bg-blue-800',
    dataAiHint: 'ice melting',
  }
  // Example of how to add more games in the future:
  // {
  //   id: 'zen-stones',
  //   name: 'Zen Stones',
  //   description: 'Stack stones to find your balance.',
  //   icon: Layers, // Example icon
  //   route: '/games/zen-stones', // This route would need to be created
  //   color: 'bg-stone-100 dark:bg-stone-700',
  //   dataAiHint: 'zen stones',
  // },
  // {
  //   id: 'star-gazer',
  //   name: 'Star Gazer',
  //   description: 'Connect the stars and find constellations.',
  //   icon: Sparkles, // Example icon
  //   route: '/games/star-gazer',
  //   color: 'bg-indigo-100 dark:bg-indigo-800',
  //   dataAiHint: 'stars night sky',
  // }
];

export interface AmbientSound {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: 'Rain', icon: CloudDrizzle },
  { id: 'wind', name: 'Wind', icon: Wind },
  { id: 'none', name: 'Silence', icon: VolumeX },
];

export const PLATFORM_ICON = Brain;
export const PLATFORM_TITLE = "Mindful Moments";
export const PLATFORM_SUBTITLE = "Your space for quick digital detox and relaxation.";
