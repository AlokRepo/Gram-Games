
'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AMBIENT_SOUNDS } from '@/lib/gameData';
import { useAmbientSounds } from '@/hooks/useAmbientSounds';
import { Headphones } from 'lucide-react';

export default function AmbientSoundControls() {
  const { playSound, activeSoundId, initializeAudio, isInitialized } = useAmbientSounds();

  // Attempt to initialize audio on mount, or on first interaction if needed by browser
  useEffect(() => {
    if (!isInitialized) {
      // Deferring explicit initializeAudio call to first button click
      // to better comply with browser autoplay policies.
      // initializeAudio(); 
    }
  }, [isInitialized, initializeAudio]);

  const handleSoundSelect = async (soundId: string) => {
    if (!isInitialized) {
      await initializeAudio(); // Ensure audio is ready on first interaction
    }
    playSound(soundId);
  };

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-semibold text-primary flex items-center">
          <Headphones className="mr-2 h-5 w-5" /> Ambient Sounds
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2">
          {AMBIENT_SOUNDS.map(sound => {
            const Icon = sound.icon;
            return (
              <Button
                key={sound.id}
                variant={activeSoundId === sound.id ? 'default' : 'outline'}
                onClick={() => handleSoundSelect(sound.id)}
                className="flex-1 min-w-[100px]"
                aria-pressed={activeSoundId === sound.id}
              >
                <Icon className="mr-2 h-4 w-4" />
                {sound.name}
              </Button>
            );
          })}
        </div>
        {!isInitialized && <p className="text-xs text-muted-foreground mt-2">Click a sound to enable audio.</p>}
      </CardContent>
    </Card>
  );
}
