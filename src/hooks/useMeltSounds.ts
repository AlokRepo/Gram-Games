
// @ts-nocheck : TODO, fix tone.js types
"use client";

import { useRef, useCallback, useEffect } from 'react';
import * as Tone from 'tone';

// Basic sound definitions for different materials
const soundEffects = {
  melt_ice: { note: 'C5', duration: '32n', type: 'noise', volume: -25 }, // Short, crisp
  melt_chocolate: { note: 'G3', duration: '16n', type: 'synth', volume: -20 }, // Lower, slightly longer
  melt_wax: { note: 'E4', duration: '24n', type: 'pluck', volume: -22 }, // Mid-range
};

export function useMeltSounds() {
  const synths = useRef<{
    noise: Tone.NoiseSynth | null;
    synth: Tone.Synth | null;
    pluck: Tone.PluckSynth | null;
  }>({ noise: null, synth: null, pluck: null });
  
  const isInitialized = useRef(false);

  const initializeAudio = useCallback(async () => {
    if (isInitialized.current) return;
    try {
      await Tone.start();
      console.log("Melt Away AudioContext started");

      const gain = new Tone.Gain(0.6).toDestination(); // General gain to control volume

      synths.current.noise = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 },
      }).connect(gain);

      synths.current.synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        // Changed envelope: sustain: 0 and shorter release to make it more percussive
        // and less prone to re-triggering issues with the internal oscillator state.
        envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }, 
      }).connect(gain);
      
      synths.current.pluck = new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.7
      }).connect(gain);

      isInitialized.current = true;
    } catch (error) {
      console.error("Failed to initialize melt audio:", error);
    }
  }, []);

  useEffect(() => {
    // Auto-initialize on mount, actual start might be deferred by browser
    if (!isInitialized.current) {
        initializeAudio();
    }
    return () => {
      synths.current.noise?.dispose();
      synths.current.synth?.dispose();
      synths.current.pluck?.dispose();
      isInitialized.current = false;
    };
  }, [initializeAudio]);

  const playMeltSound = useCallback(async (materialSoundKey: keyof typeof soundEffects = 'melt_ice') => {
    if (!isInitialized.current) {
      await initializeAudio(); // Ensure initialized
    }
    if (!isInitialized.current || Tone.context.state !== 'running') {
      console.warn("Melt sound audio not ready or context not running.");
      return;
    }
  
    const effect = soundEffects[materialSoundKey] || soundEffects.melt_ice;
  
    try {
      // Add a small time offset to prevent scheduling at the exact same time
      const now = Tone.now();
      const scheduleTime = now + 0.001; // Add a small offset (e.g., 1ms)
  
      if (effect.type === 'noise' && synths.current.noise) {
        synths.current.noise.volume.value = effect.volume;
        // Use the calculated scheduleTime
        synths.current.noise.triggerAttackRelease(effect.duration, scheduleTime);
      } else if (effect.type === 'synth' && synths.current.synth) {
        synths.current.synth.volume.value = effect.volume;
        // Use the calculated scheduleTime
        synths.current.synth.triggerAttackRelease(effect.note, effect.duration, scheduleTime);
      } else if (effect.type === 'pluck' && synths.current.pluck) {
         synths.current.pluck.volume.value = effect.volume;
         // Use the calculated scheduleTime
         synths.current.pluck.triggerAttackRelease(effect.note, scheduleTime); // PluckSynth duration is inherent
      }
    } catch (e) {
      console.error("Error playing melt sound:", e);
    }
  }, [initializeAudio]);

  return { playMeltSound, initializeAudio };
}

