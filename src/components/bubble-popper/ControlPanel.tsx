"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import ScoreDisplay from './ScoreDisplay';
import ThemeSelector from './ThemeSelector';
import type { ThemeOption } from '@/lib/themes';
import { Play, RotateCcw, Pause } from 'lucide-react';

interface ControlPanelProps {
  score: number;
  highScore: number;
  onStartGame: () => void;
  onResetGame: () => void;
  currentThemeId: ThemeOption['id'];
  unlockedThemes: ThemeOption['id'][];
  onSelectTheme: (themeId: ThemeOption['id']) => void;
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameover';
  currentScore: number; // For theme selector unlock check
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  score,
  highScore,
  onStartGame,
  onResetGame,
  currentThemeId,
  unlockedThemes,
  onSelectTheme,
  gameStatus,
  currentScore,
}) => {
  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full max-w-lg rounded-lg bg-background/70 backdrop-blur-sm shadow-xl">
      <ScoreDisplay score={score} highScore={highScore} />
      
      <div className="flex gap-4">
        {gameStatus === 'idle' || gameStatus === 'gameover' || gameStatus === 'paused' ? (
          <Button onClick={onStartGame} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
            <Play className="mr-2 h-5 w-5" /> {gameStatus === 'paused' ? 'Resume' : 'Start Game'}
          </Button>
        ) : (
           <Button onClick={onStartGame} size="lg" variant="outline" className="shadow-md"> {/* Assuming onStartGame handles pause too */}
            <Pause className="mr-2 h-5 w-5" /> Pause
          </Button>
        )}
        <Button onClick={onResetGame} variant="destructive" size="lg" className="shadow-md">
          <RotateCcw className="mr-2 h-5 w-5" /> Reset
        </Button>
      </div>
      
      { (gameStatus === 'idle' || gameStatus === 'gameover' || gameStatus === 'paused') && (
        <ThemeSelector
          currentThemeId={currentThemeId}
          unlockedThemes={unlockedThemes}
          onSelectTheme={onSelectTheme}
          currentScore={currentScore}
        />
      )}
    </div>
  );
};

export default ControlPanel;
