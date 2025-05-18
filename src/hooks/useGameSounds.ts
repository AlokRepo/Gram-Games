// @ts-nocheck : TODO, fix tone.js types
"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';

export function useGameSounds() {
  const popSynth = useRef<Tone.PluckSynth | null>(null);
  const isInitialized = useRef(false);

  const initializeAudio = useCallback(async () => {
    if (isInitialized.current) return;
    try {
      // Ensure Tone.start() is called to enable audio context, typically after a user gesture.
      // However, for a game, we often want sounds ready. It might be called on the first interaction.
      await Tone.start();
      console.log("AudioContext started");
      popSynth.current = new Tone.PluckSynth({
        attackNoise: 0.5,
        dampening: 4000,
        resonance: 0.9
      }).toDestination();
      isInitialized.current = true;
    } catch (error) {
      console.error("Failed to initialize audio:", error);
      // Fallback or silent mode can be handled here
    }
  }, []);

  useEffect(() => {
    // Attempt to initialize audio when the hook mounts.
    // Some browsers might block this until a user interaction.
    // initializeAudio(); // We'll call this explicitly on first game interaction

    return () => {
      popSynth.current?.dispose();
      isInitialized.current = false;
    };
  }, [initializeAudio]);

  const playPopSound = useCallback(async () => {
    if (!isInitialized.current) {
      await initializeAudio(); // Ensure initialized before playing
    }
    
    if (popSynth.current && Tone.context.state === 'running') {
      // Play a slightly randomized pitch for variety
      const pitches = ['C4', 'E4', 'G4', 'A4', 'C5'];
      const randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
      popSynth.current.triggerAttackRelease(randomPitch, '16n', Tone.now());
    } else if (Tone.context.state !== 'running') {
      console.warn("AudioContext not running. Trying to start.");
      try {
        await Tone.start();
        if (popSynth.current) {
          const pitches = ['C4', 'E4', 'G4', 'A4', 'C5'];
          const randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
          popSynth.current.triggerAttackRelease(randomPitch, '16n', Tone.now());
        }
      } catch (e) {
        console.error("Could not start AudioContext for pop sound:", e);
      }
    }
  }, [initializeAudio]);

  return { playPopSound, initializeAudio };
}
