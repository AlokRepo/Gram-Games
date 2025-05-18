
// @ts-nocheck : TODO, fix tone.js types
'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import * as Tone from 'tone';
import type { AmbientSound } from '@/lib/gameData';
import { AMBIENT_SOUNDS } from '@/lib/gameData';

interface SoundSource {
  synth: Tone.Noise | Tone.Player | null; // Player for potential future file-based sounds
  volume: Tone.Volume | null;
}

export function useAmbientSounds() {
  const sounds = useRef<Record<string, SoundSource>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeSoundId, setActiveSoundId] = useState<string | null>(AMBIENT_SOUNDS.find(s => s.id === 'none')?.id || null);
  const masterVolume = useRef<Tone.Volume | null>(null);

  const initializeAudio = useCallback(async () => {
    if (isInitialized) return;
    try {
      await Tone.start();
      console.log("Ambient AudioContext started");

      masterVolume.current = new Tone.Volume(-10).toDestination(); // Master volume for ambient sounds

      // Initialize Rain Sound (White Noise)
      const rainVolume = new Tone.Volume(-15).connect(masterVolume.current); // Quieter by default
      const rainSynth = new Tone.Noise("white").connect(rainVolume);
      sounds.current['rain'] = { synth: rainSynth, volume: rainVolume };

      // Initialize Wind Sound (Pink Noise with Filter)
      const windVolume = new Tone.Volume(-18).connect(masterVolume.current); // Even quieter
      const windSynth = new Tone.Noise("pink").connect(windVolume);
      // Add a filter to make it more wind-like
      const windFilter = new Tone.AutoFilter({
        frequency: "8m", // Slow LFO
        baseFrequency: 400,
        octaves: 4
      }).connect(windVolume);
      windSynth.connect(windFilter); // Connect noise to filter, then filter to volume
      sounds.current['wind'] = { synth: windSynth, volume: windVolume }; // Store synth (noise) and its volume node

      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize ambient audio:", error);
    }
  }, [isInitialized]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      Object.values(sounds.current).forEach(sound => {
        sound.synth?.dispose();
        sound.volume?.dispose();
      });
      masterVolume.current?.dispose();
      sounds.current = {};
      setIsInitialized(false);
    };
  }, []);

  const playSound = useCallback(async (soundId: string | null) => {
    if (!isInitialized) {
      await initializeAudio();
    }
    if (!isInitialized && soundId !== 'none') { // Check again after init attempt
        console.warn("Audio not initialized, cannot play sound.");
        return;
    }


    // Stop any currently playing sound
    Object.entries(sounds.current).forEach(([id, soundObj]) => {
      if (soundObj.synth instanceof Tone.Noise) { // Check if it's a startable/stoppable synth
        if (soundObj.synth.state === "started") {
          soundObj.synth.stop();
        }
      }
    });

    setActiveSoundId(soundId);

    if (soundId && soundId !== 'none' && sounds.current[soundId]) {
      const soundToPlay = sounds.current[soundId];
      if (soundToPlay.synth instanceof Tone.Noise && soundToPlay.synth.state !== "started") {
        soundToPlay.synth.start();
      }
    }
  }, [isInitialized, initializeAudio]);

  return { playSound, activeSoundId, initializeAudio, isInitialized };
}
