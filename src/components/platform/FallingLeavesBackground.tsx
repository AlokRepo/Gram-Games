
'use client';

import React, { useMemo } from 'react';

const NUM_LEAVES = 15; // Number of leaves to render

interface LeafStyleProps {
  left: string;
  animationDuration: string;
  animationDelay: string;
  sizeFactor: number;
  type: number; // For different animation/style variations
}

const FallingLeavesBackground: React.FC = () => {
  const leafStyles = useMemo(() => {
    const styles: LeafStyleProps[] = [];
    for (let i = 0; i < NUM_LEAVES; i++) {
      styles.push({
        left: `${Math.random() * 100}vw`, // Random horizontal start position
        animationDuration: `${8 + Math.random() * 10}s`, // Fall duration between 8 and 18 seconds
        animationDelay: `${Math.random() * 15}s`,      // Animation start delay up to 15 seconds
        sizeFactor: 0.6 + Math.random() * 0.8, // Random size scale (0.6x to 1.4x)
        type: i % 3 // Cycle through 3 types for varied animations/colors
      });
    }
    return styles;
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none" 
      aria-hidden="true"
    >
      {leafStyles.map((style, index) => (
        <div
          key={index}
          className={`falling-leaf leaf-type-${style.type}`}
          style={{
            left: style.left,
            animationDuration: style.animationDuration,
            animationDelay: style.animationDelay,
            transform: `scale(${style.sizeFactor})`, // Apply random size scale
          }}
        >
          {/* The leaf itself is styled entirely by CSS */}
        </div>
      ))}
    </div>
  );
};

export default FallingLeavesBackground;
