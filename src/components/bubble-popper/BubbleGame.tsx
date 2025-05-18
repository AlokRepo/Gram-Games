
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Bubble from './Bubble';
import ControlPanel from './ControlPanel';
import { useGameSounds } from '@/hooks/useGameSounds';
import { THEMES, DEFAULT_THEME_ID, getThemeById, ThemeOption } from '@/lib/themes';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

const GAME_AREA_HEIGHT_PX = 600; // Increased from 500
const BUBBLE_MIN_SIZE = 25;
const BUBBLE_MAX_SIZE = 70;
const MAX_BUBBLES = 20; // Slightly increased max bubbles for larger area
const BASE_POINTS_PER_BUBBLE = 10;

type BubbleType = 'normal' | 'fast' | 'slow' | 'large' | 'small';

interface BubbleState {
  id: string;
  x: number; // percentage 0-100
  y: number; // pixels from bottom, starts at 0
  size: number;
  color: string;
  speedY: number; // pixels per frame for upward movement
  type: BubbleType;
  isPopped: boolean;
  createdAt: number;
}

const BubbleGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bubbles, setBubbles] = useState<BubbleState[]>([]);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [currentThemeId, setCurrentThemeId] = useState<ThemeOption['id']>(DEFAULT_THEME_ID);
  const [unlockedThemes, setUnlockedThemes] = useState<ThemeOption['id'][]>([DEFAULT_THEME_ID]);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { playPopSound, initializeAudio } = useGameSounds();
  const { toast } = useToast();
  const animationFrameId = useRef<number | null>(null);
  const lastBubbleSpawnTime = useRef<number>(0);
  const spawnInterval = useRef<number>(1000); //ms

  const currentTheme = getThemeById(currentThemeId) || getThemeById(DEFAULT_THEME_ID)!;

  // Load/Save progress
  useEffect(() => {
    const savedHighScore = localStorage.getItem('bubblePopperHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));

    const savedUnlockedThemes = localStorage.getItem('bubblePopperUnlockedThemes');
    if (savedUnlockedThemes) {
      try {
        const parsedThemes = JSON.parse(savedUnlockedThemes) as ThemeOption['id'][];
        setUnlockedThemes(parsedThemes);
        // Ensure default theme is always unlocked
        if (!parsedThemes.includes(DEFAULT_THEME_ID)) {
            setUnlockedThemes(prev => Array.from(new Set([...prev, DEFAULT_THEME_ID])));
        }
      } catch (e) { console.error("Failed to parse unlocked themes:", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bubblePopperHighScore', highScore.toString());
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem('bubblePopperUnlockedThemes', JSON.stringify(unlockedThemes));
  }, [unlockedThemes]);

  const checkThemeUnlocks = useCallback((currentScore: number) => {
    let newThemesUnlocked = false;
    THEMES.forEach(theme => {
      if (currentScore >= theme.unlockScore && !unlockedThemes.includes(theme.id)) {
        setUnlockedThemes(prev => Array.from(new Set([...prev, theme.id])));
        toast({
          title: "New Theme Unlocked!",
          description: `You've unlocked the ${theme.name} theme!`,
        });
        newThemesUnlocked = true;
      }
    });
    return newThemesUnlocked;
  }, [unlockedThemes, toast]);

  const generateBubble = useCallback(() => {
    if (bubbles.length >= MAX_BUBBLES || !gameAreaRef.current) return;

    const typeRandom = Math.random();
    let type: BubbleType;
    let speedMultiplier = 1;
    let sizeModifier = 0;

    if (typeRandom < 0.15) { type = 'fast'; speedMultiplier = 1.8; }
    else if (typeRandom < 0.3) { type = 'slow'; speedMultiplier = 0.6; }
    else if (typeRandom < 0.45) { type = 'large'; sizeModifier = 20; }
    else if (typeRandom < 0.6) { type = 'small'; sizeModifier = -15; }
    else { type = 'normal'; }
    
    const size = Math.max(15, Math.random() * (BUBBLE_MAX_SIZE - BUBBLE_MIN_SIZE) + BUBBLE_MIN_SIZE + sizeModifier);
    // Ensure bubble is fully within horizontal bounds
    const maxBubbleX = 100 - (size / gameAreaRef.current.clientWidth * 100);
    const x = Math.random() * maxBubbleX;

    const newBubble: BubbleState = {
      id: Math.random().toString(36).substr(2, 9),
      x: x,
      y: 0, // Start at the bottom
      size: size,
      color: currentTheme.bubbleColors[Math.floor(Math.random() * currentTheme.bubbleColors.length)],
      speedY: (Math.random() * 0.5 + 0.5) * speedMultiplier, // Base speed + random variation, adjusted by type
      type: type,
      isPopped: false,
      createdAt: Date.now(),
    };
    setBubbles(prev => [...prev, newBubble]);
  }, [bubbles.length, currentTheme.bubbleColors]);

  const popBubble = useCallback((id: string) => {
    playPopSound();
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, isPopped: true } : b));
    
    const poppedBubble = bubbles.find(b => b.id === id);
    let points = BASE_POINTS_PER_BUBBLE;
    if (poppedBubble) {
      if (poppedBubble.type === 'fast') points *= 1.5;
      if (poppedBubble.type === 'small') points *= 1.2;
    }

    setScore(prevScore => {
      const newScore = prevScore + Math.round(points);
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      checkThemeUnlocks(newScore);
      return newScore;
    });
  }, [playPopSound, highScore, checkThemeUnlocks, bubbles]);


  const gameLoop = useCallback((timestamp: number) => {
    if (gameStatus !== 'playing') {
      animationFrameId.current = null; // Ensure it's cleared if not playing
      return;
    }

    setBubbles(prevBubbles => 
      prevBubbles
        .map(b => ({ ...b, y: b.y + b.speedY }))
        .filter(b => {
          if (b.isPopped && Date.now() - b.createdAt > 300) return false; // Remove after pop animation (300ms)
          if (!b.isPopped && b.y > GAME_AREA_HEIGHT_PX) return false; // Remove if off-screen
          return true;
        })
    );
    
    if (timestamp - lastBubbleSpawnTime.current > spawnInterval.current) {
        generateBubble();
        lastBubbleSpawnTime.current = timestamp;
        // Gradually decrease spawn interval to increase difficulty
        spawnInterval.current = Math.max(300, spawnInterval.current * 0.995);
    }

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameStatus, generateBubble]);


  useEffect(() => {
    if (gameStatus === 'playing') {
      lastBubbleSpawnTime.current = performance.now();
      spawnInterval.current = 1000; // Reset spawn interval on game start
      animationFrameId.current = requestAnimationFrame(gameLoop);
    } else if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [gameStatus, gameLoop]);


  const startGame = async () => {
    await initializeAudio(); // Ensure audio is ready on first interaction
    if (gameStatus === 'idle' || gameStatus === 'gameover') {
      setScore(0);
      setBubbles([]);
      setGameStatus('playing');
    } else if (gameStatus === 'playing') {
      setGameStatus('paused');
    } else if (gameStatus === 'paused') {
      setGameStatus('playing');
    }
  };

  const resetGame = () => {
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = null;
    setScore(0);
    setBubbles([]);
    setGameStatus('idle');
    spawnInterval.current = 1000; // Reset spawn interval
  };

  const handleSelectTheme = (themeId: ThemeOption['id']) => {
    if (unlockedThemes.includes(themeId)) {
      setCurrentThemeId(themeId);
    } else {
      const themeToUnlock = THEMES.find(t => t.id === themeId);
      if (themeToUnlock) {
        toast({
            title: "Theme Locked",
            description: `Unlock ${themeToUnlock.name} by reaching ${themeToUnlock.unlockScore} points.`,
            variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <ControlPanel
        score={score}
        highScore={highScore}
        onStartGame={startGame}
        onResetGame={resetGame}
        currentThemeId={currentThemeId}
        unlockedThemes={unlockedThemes}
        onSelectTheme={handleSelectTheme}
        gameStatus={gameStatus}
        currentScore={score}
      />
      <Card 
        ref={gameAreaRef} 
        className={cn(
          "relative w-full max-w-2xl mt-4 shadow-2xl game-area overflow-hidden rounded-xl border-4 border-primary/30", // Changed from max-w-xl
          currentTheme.backgroundClasses
        )}
        style={{ height: `${GAME_AREA_HEIGHT_PX}px` }}
      >
        {bubbles.map(bubble => (
          <Bubble
            key={bubble.id}
            {...bubble}
            onPop={popBubble}
            isPopped={bubble.isPopped}
          />
        ))}
        {(gameStatus === 'idle' || gameStatus === 'gameover' || gameStatus === 'paused') && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg">
                <p className="text-3xl font-bold text-white shadow-lg">
                    {gameStatus === 'idle' && "Click Start to Play!"}
                    {gameStatus === 'gameover' && `Game Over! Score: ${score}`}
                    {gameStatus === 'paused' && "Paused"}
                </p>
            </div>
        )}
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">
        Tip: Faster and smaller bubbles give more points! Pop responsibly.
      </p>
    </div>
  );
};

export default BubbleGame;
