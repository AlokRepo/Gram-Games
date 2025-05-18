
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp } from 'lucide-react';

const RELAXATION_TIME_KEY = 'relaxationPlatformTime';

export default function RelaxationTracker() {
  const [totalRelaxedSeconds, setTotalRelaxedSeconds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    const savedTime = localStorage.getItem(RELAXATION_TIME_KEY);
    if (savedTime) {
      setTotalRelaxedSeconds(parseInt(savedTime, 10));
    }
    setSessionStartTime(Date.now()); // Start session timer on mount

    // Update time every 5 seconds
    const intervalId = setInterval(() => {
      setTotalRelaxedSeconds(prevTime => {
        const newTime = sessionStartTime ? prevTime + Math.floor((Date.now() - sessionStartTime) / 1000 - prevTime) : prevTime;
        // This logic is a bit simplified, it basically adds elapsed time since mount.
        // A more robust solution would track active engagement.
        // For now, it tracks time spent on the platform page.
        return prevTime + 5; // Simplified: Add 5 seconds every 5 seconds the component is mounted
      });
    }, 5000);
    
    return () => {
      clearInterval(intervalId);
      // Save on unmount
      localStorage.setItem(RELAXATION_TIME_KEY, totalRelaxedSeconds.toString());
    };
  }, []); // Run only on mount and unmount

  // Save to localStorage periodically and on visibility change
   useEffect(() => {
    const saveTime = () => {
      localStorage.setItem(RELAXATION_TIME_KEY, totalRelaxedSeconds.toString());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveTime();
      } else {
        setSessionStartTime(Date.now()); // Reset session start time when tab becomes visible
      }
    };

    window.addEventListener('beforeunload', saveTime);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Save every 30 seconds
    const periodicSaveInterval = setInterval(saveTime, 30000);

    return () => {
      clearInterval(periodicSaveInterval);
      window.removeEventListener('beforeunload', saveTime);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      saveTime(); // Final save on component unmount
    };
  }, [totalRelaxedSeconds]);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0 && remainingSeconds === 0) return "Just starting";
    if (minutes < 1) return `${remainingSeconds} sec`;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-semibold text-primary flex items-center">
          <Clock className="mr-2 h-5 w-5" /> Relaxation Time
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-3xl font-bold text-foreground">
          {formatTime(totalRelaxedSeconds)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          You've relaxed on the platform today!
        </p>
      </CardContent>
    </Card>
  );
}
