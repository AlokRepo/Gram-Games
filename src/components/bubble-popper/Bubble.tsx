"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface BubbleProps {
  id: string;
  x: number; // percentage from left
  y: number; // pixels from bottom
  size: number;
  color: string;
  isPopped: boolean;
  onPop: (id: string) => void;
  type: 'normal' | 'fast' | 'slow' | 'large' | 'small'; // For potential future styling or behavior
}

const Bubble: React.FC<BubbleProps> = React.memo(({ id, x, y, size, color, isPopped, onPop, type }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent event bubbling if needed
    if (!isPopped) {
      onPop(id);
    }
  };

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!isPopped) {
      onPop(id);
    }
  };
  
  // Base speed is inversely proportional to size, adjust as needed
  const animationDuration = type === 'fast' ? '3s' : type === 'slow' ? '10s' : `${6 + Math.random() * 4}s`;

  return (
    <div
      className={cn(
        'absolute rounded-full cursor-pointer shadow-lg transition-opacity duration-300 ease-out',
        isPopped ? 'bubble-pop-animation pointer-events-none' : 'bubble-animation',
      )}
      style={{
        left: `${x}%`,
        bottom: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        opacity: isPopped ? 0 : 1,
        animationDuration: animationDuration, // for the bobbing effect
        // Add a subtle border or gradient for a more "bubbly" look
        border: `1px solid rgba(255, 255, 255, 0.3)`,
        backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, ${color} 70%)`,
      }}
      onClick={handleClick}
      onTouchStart={handleTouch} // Use onTouchStart for faster response on mobile
      role="button"
      aria-label={`Pop bubble ${type}`}
      tabIndex={0} // Make it focusable, though primarily for click/touch
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPop(id)}}
    >
      {/* Optional: Inner shine effect for more realism */}
      <div 
        className="absolute w-1/3 h-1/3 rounded-full bg-white opacity-30"
        style={{ top: '15%', left: '20%', filter: 'blur(2px)'}}
      />
    </div>
  );
});

Bubble.displayName = 'Bubble';
export default Bubble;
