
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { Material } from '@/lib/meltAwayData';

interface SculptureCellProps {
  isSolid: boolean;
  isMelted: boolean;
  material: Material;
  onPointerEnter: () => void; // For drag-melting
}

const SculptureCell: React.FC<SculptureCellProps> = ({
  isSolid,
  isMelted,
  material,
  onPointerEnter,
}) => {
  if (!isSolid) {
    return <div className="aspect-square bg-transparent" />;
  }

  const cellColor = isMelted ? material.meltedColor : material.baseColor;

  return (
    <div
      className={cn(
        'aspect-square transition-all duration-500 ease-out border border-white/10',
        cellColor,
        isMelted ? 'opacity-30 scale-90' : 'opacity-100 scale-100',
        'cursor-grab' // Indicates draggable interaction
      )}
      onPointerEnter={onPointerEnter} // Use pointer enter for smoother drag on desktop
      onTouchMove={onPointerEnter} // Handle touch move for mobile drag
      role="button"
      aria-label={isMelted ? "Melted part of sculpture" : "Part of sculpture"}
      style={{ touchAction: 'none' }} // Prevents scrolling while dragging on touch devices
    />
  );
};

export default React.memo(SculptureCell);
