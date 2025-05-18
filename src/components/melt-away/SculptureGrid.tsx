
"use client";

import React, { useState, useCallback } from 'react';
import SculptureCell from './SculptureCell';
import type { Sculpture, Material } from '@/lib/meltAwayData';
import { cn } from '@/lib/utils';

interface SculptureGridProps {
  sculpture: Sculpture;
  material: Material;
  onCellMelt: (rowIndex: number, colIndex: number) => void;
  meltedState: boolean[][];
}

const SculptureGrid: React.FC<SculptureGridProps> = ({
  sculpture,
  material,
  onCellMelt,
  meltedState,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // This function handles both mouse enter (while dragging) and touch move
  const handleCellPointerAction = useCallback((rowIndex: number, colIndex: number) => {
    if (isDragging || ('ontouchstart' in window)) { // For touch, melt on move without explicit drag state
       if (sculpture.grid[rowIndex][colIndex] && !meltedState[rowIndex][colIndex]) {
        onCellMelt(rowIndex, colIndex);
      }
    }
  }, [isDragging, onCellMelt, sculpture.grid, meltedState]);

  const gridTemplateColumns = `repeat(${sculpture.grid[0]?.length || 1}, minmax(0, 1fr))`;

  return (
    <div
      className={cn(
        "grid gap-0.5 p-1 rounded-md shadow-lg max-w-md w-full mx-auto bg-slate-500/10 touch-none select-none"
      )}
      style={{ gridTemplateColumns }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp} // Stop dragging if mouse leaves the grid
      onTouchStart={handlePointerDown} // Similar handling for touch
      onTouchEnd={handlePointerUp}
      role="grid"
      aria-label={`${sculpture.name} made of ${material.name}`}
    >
      {sculpture.grid.map((row, rowIndex) =>
        row.map((isSolid, colIndex) => (
          <SculptureCell
            key={`${rowIndex}-${colIndex}`}
            isSolid={isSolid}
            isMelted={meltedState[rowIndex]?.[colIndex] || false}
            material={material}
            onPointerEnter={() => handleCellPointerAction(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default React.memo(SculptureGrid);
