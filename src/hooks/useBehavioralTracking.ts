'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useBehavioralTracking = (onAutoSubmit: () => void) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const MAX_WARNINGS = 5;

  const handleViolation = useCallback((message: string, type: 'tab' | 'fullscreen') => {
    if (type === 'tab') {
      setTabSwitchCount((prev) => prev + 1);
    } else {
      setFullscreenExitCount((prev) => prev + 1);
    }

    setWarnings((prev) => {
      const newWarnings = prev + 1;
      if (newWarnings >= MAX_WARNINGS) {
        toast.error('Maximum violations reached. Auto-submitting...', { duration: 5000 });
        onAutoSubmit();
        return prev;
      }
      toast.warning(`${message} (Violation ${newWarnings}/${MAX_WARNINGS})`);
      return newWarnings;
    });
  }, [onAutoSubmit]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleViolation('Tab switching is prohibited during the exam.', 'tab');
      }
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation('Exiting full screen is restricted.', 'fullscreen');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [handleViolation]);

  const enterFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen request failed:', err);
    }
  };

  return { tabSwitchCount, fullscreenExitCount, warnings, enterFullScreen };
};
