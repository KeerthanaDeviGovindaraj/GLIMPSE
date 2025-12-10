import { useState, useEffect, useCallback } from 'react';

export const useAutoGenerate = (generateFunction, interval = 15000, autoStart = true) => {
  const [isRunning, setIsRunning] = useState(autoStart);
  const [lastGenerated, setLastGenerated] = useState(null);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      generateFunction();
      setLastGenerated(new Date());
    }, interval);

    // Generate immediately on start
    if (autoStart) {
      generateFunction();
      setLastGenerated(new Date());
    }

    return () => clearInterval(intervalId);
  }, [isRunning, interval, generateFunction]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const generateNow = useCallback(() => {
    generateFunction();
    setLastGenerated(new Date());
  }, [generateFunction]);

  return {
    isRunning,
    lastGenerated,
    start,
    stop,
    toggle,
    generateNow
  };
};