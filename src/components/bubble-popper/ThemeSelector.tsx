"use client";

import React from 'react';
import { THEMES, ThemeOption } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeSelectorProps {
  currentThemeId: ThemeOption['id'];
  unlockedThemes: ThemeOption['id'][];
  onSelectTheme: (themeId: ThemeOption['id']) => void;
  currentScore: number;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentThemeId, unlockedThemes, onSelectTheme, currentScore }) => {
  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-card/80 shadow">
      <h3 className="text-lg font-semibold text-foreground">Game Themes</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {THEMES.map((theme) => {
          const isUnlocked = unlockedThemes.includes(theme.id) || currentScore >= theme.unlockScore;
          const Icon = theme.icon;
          return (
            <TooltipProvider key={theme.id} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentThemeId === theme.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => isUnlocked && onSelectTheme(theme.id)}
                    disabled={!isUnlocked && currentThemeId !== theme.id}
                    className={`relative transition-all duration-200 ease-in-out transform hover:scale-105 w-28 h-20 flex flex-col items-center justify-center shadow-sm ${
                      !isUnlocked ? 'opacity-60 cursor-not-allowed' : ''
                    } ${currentThemeId === theme.id ? 'ring-2 ring-primary-foreground' : ''}`}
                  >
                    <Icon className={`mb-1 h-6 w-6 ${currentThemeId === theme.id ? 'text-primary-foreground' : 'text-primary'}`} />
                    <span className={`text-xs ${currentThemeId === theme.id ? 'text-primary-foreground' : 'text-foreground'}`}>{theme.name}</span>
                    {currentThemeId === theme.id && (
                      <CheckCircle className="absolute top-1 right-1 h-4 w-4 text-primary-foreground" />
                    )}
                    {!isUnlocked && (
                      <Lock className="absolute bottom-1 right-1 h-3 w-3 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                {!isUnlocked && (
                   <TooltipContent side="bottom">
                    <p>Unlock at {theme.unlockScore} points</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
