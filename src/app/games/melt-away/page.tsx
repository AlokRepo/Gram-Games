
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Zap, RotateCcw, Sparkles as SparklesIcon } from 'lucide-react';
import SculptureGrid from '@/components/melt-away/SculptureGrid';
import { MATERIALS, SCULPTURES, getDefaultSculpture, getDefaultMaterial } from '@/lib/meltAwayData';
import type { Sculpture, Material } from '@/lib/meltAwayData';
import { useMeltSounds } from '@/hooks/useMeltSounds';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MeltAwayPage: React.FC = () => {
  const [currentSculpture, setCurrentSculpture] = useState<Sculpture>(getDefaultSculpture());
  const [currentMaterial, setCurrentMaterial] = useState<Material>(
     MATERIALS.find(m => m.id === getDefaultSculpture().defaultMaterialId) || getDefaultMaterial()
  );
  
  const initialMeltedState = useMemo(() => 
    currentSculpture.grid.map(row => row.map(() => false)),
    [currentSculpture]
  );
  const [meltedState, setMeltedState] = useState<boolean[][]>(initialMeltedState);
  const [isComplete, setIsComplete] = useState(false);
  const [meltCount, setMeltCount] = useState(0);

  const { playMeltSound, initializeAudio: initializeMeltAudio } = useMeltSounds();

  const totalSolidCells = useMemo(() => {
    return currentSculpture.grid.reduce((sum, row) => 
      sum + row.filter(cell => cell).length, 0);
  }, [currentSculpture]);

  useEffect(() => {
    // Initialize audio on component mount or first interaction
    initializeMeltAudio();
  }, [initializeMeltAudio]);

  useEffect(() => {
    // Reset melted state when sculpture changes
    setMeltedState(currentSculpture.grid.map(row => row.map(() => false)));
    // meltCount will be reset by the effect below that derives it from meltedState
    setIsComplete(false); 
    // Update material if sculpture has a different default
    const newSculptureDefaultMaterial = MATERIALS.find(m => m.id === currentSculpture.defaultMaterialId) || currentMaterial;
    setCurrentMaterial(newSculptureDefaultMaterial);
  }, [currentSculpture, setCurrentMaterial]); // Added setCurrentMaterial to dep array as it's used

  // Derive meltCount from meltedState and currentSculpture
  useEffect(() => {
    let count = 0;
    if (currentSculpture && meltedState && meltedState.length === currentSculpture.grid.length) {
      for (let r = 0; r < currentSculpture.grid.length; r++) {
        if (currentSculpture.grid[r] && meltedState[r] && meltedState[r].length === currentSculpture.grid[r].length) {
          for (let c = 0; c < currentSculpture.grid[r].length; c++) {
            if (currentSculpture.grid[r][c] && meltedState[r][c]) { // If it's a solid part AND it's melted
              count++;
            }
          }
        }
      }
    }
    setMeltCount(count);
  }, [meltedState, currentSculpture]);


  const handleCellMelt = useCallback((rowIndex: number, colIndex: number) => {
    setMeltedState(prev => {
      const newState = prev.map(r => [...r]);
      if (newState[rowIndex]?.[colIndex] === false) { // only melt if not already melted and exists
        newState[rowIndex][colIndex] = true;
        // meltCount is now derived, no longer incremented here
        playMeltSound(currentMaterial.sound as any);
      }
      return newState;
    });
  }, [playMeltSound, currentMaterial.sound]);

  useEffect(() => {
    if (totalSolidCells > 0 && meltCount >= totalSolidCells) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [meltCount, totalSolidCells]);

  const handleSculptureChange = (sculptureId: string) => {
    const newSculpture = SCULPTURES.find(s => s.id === sculptureId) || getDefaultSculpture();
    setCurrentSculpture(newSculpture);
  };

  const handleMaterialChange = (materialId: string) => {
    const newMaterial = MATERIALS.find(m => m.id === materialId) || getDefaultMaterial();
    setCurrentMaterial(newMaterial);
  };

  const resetSculpture = () => {
    // Setting the sculpture will trigger the useEffect to reset meltCount and meltedState
    setCurrentSculpture(prev => ({...prev})); // Force re-trigger of sculpture change effect
    setIsComplete(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-800 dark:to-sky-900 p-2 sm:p-4 pt-10">
      <Card className="w-full max-w-2xl mb-6 shadow-xl bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <Link href="/" passHref>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
              </Button>
            </Link>
            <CardTitle className="text-3xl font-semibold text-primary">Melt Away</CardTitle>
            <div className="w-24"> {/* Spacer */} </div>
          </div>
          <CardDescription className="text-center text-muted-foreground">
            Gently drag over the sculpture to melt it. Find a moment of calm.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="sculpture-select" className="text-sm font-medium text-foreground/80 mb-1 block">Sculpture:</label>
              <Select value={currentSculpture.id} onValueChange={handleSculptureChange}>
                <SelectTrigger id="sculpture-select" className="w-full">
                  <SelectValue placeholder="Select sculpture" />
                </SelectTrigger>
                <SelectContent>
                  {SCULPTURES.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="material-select" className="text-sm font-medium text-foreground/80 mb-1 block">Material:</label>
              <Select value={currentMaterial.id} onValueChange={handleMaterialChange}>
                <SelectTrigger id="material-select" className="w-full">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {MATERIALS.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative w-full aspect-square max-w-md flex items-center justify-center">
            {!isComplete ? (
              <SculptureGrid
                sculpture={currentSculpture}
                material={currentMaterial}
                onCellMelt={handleCellMelt}
                meltedState={meltedState}
              />
            ) : (
              <div className="text-center p-8 bg-green-500/20 rounded-lg shadow-inner flex flex-col items-center gap-4">
                <SparklesIcon className="w-16 h-16 text-yellow-400 animate-pulse" />
                <h3 className="text-2xl font-semibold text-green-700 dark:text-green-300">Sculpture Melted!</h3>
                <p className="text-muted-foreground">You've found a moment of peace.</p>
                <Button onClick={resetSculpture} variant="ghost" size="sm" className="mt-2">
                  <RotateCcw className="mr-2 h-4 w-4" /> Melt Again
                </Button>
              </div>
            )}
          </div>
           {!isComplete && (
            <p className={cn(
              "text-sm text-muted-foreground transition-opacity duration-500",
              (meltCount > 0 && totalSolidCells > 0) ? "opacity-0" : "opacity-100" // only hide if melting has started on a non-empty sculpture
            )}>
              Drag your mouse or finger to start melting.
            </p>
          )}
          {isComplete && (
             <Button onClick={() => handleSculptureChange(SCULPTURES[(SCULPTURES.findIndex(s => s.id === currentSculpture.id) + 1) % SCULPTURES.length].id)} className="mt-4">
                Next Sculpture <Zap className="ml-2 h-4 w-4"/>
            </Button>
          )}

        </CardContent>
      </Card>
       <p className="mt-4 text-xs text-muted-foreground max-w-md text-center">
        Tip: Try different sculptures and materials for varied melting experiences. Sound on for full effect!
      </p>
    </main>
  );
};

export default MeltAwayPage;
