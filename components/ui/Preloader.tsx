'use client';

import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete?: () => void;
  isMapReady?: boolean;
}

export const Preloader: React.FC<LoaderProps> = ({ onComplete, isMapReady }) => {
  const [percent, setPercent] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING CORE');
  const [isHidden, setIsHidden] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    let currentPct = 0;
    let targetPct = 18;
    let isDone = false;
    const startTime = Date.now();
    const MIN_DISPLAY_TIME = 2400; // 2.4s for full contour trace and branding rise

    const stages = [
      { target: 32, text: 'INITIALIZING CORE', delay: 200 },
      { target: 58, text: 'CALIBRATING TERRAIN ELEVATION', delay: 650 },
      { target: 78, text: 'MAPPING TOPOGRAPHIC CONTOURS', delay: 1200 },
      { target: 92, text: 'PREPARING HIMALAYAN SITES', delay: 1750 }
    ];

    stages.forEach((st) => {
      setTimeout(() => {
        if (!isDone && currentPct < st.target) {
          targetPct = st.target;
          setStatusText(st.text);
        }
      }, st.delay);
    });

    const interval = setInterval(() => {
      if (currentPct < targetPct) {
        currentPct += (targetPct - currentPct) * 0.22 + 0.5;
        if (currentPct > targetPct) currentPct = targetPct;
        setPercent(Math.round(currentPct));
      }
    }, 40);

    const finish = () => {
      if (isDone) return;
      isDone = true;
      clearInterval(interval);

      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, MIN_DISPLAY_TIME - elapsed);

      setTimeout(() => {
        setPercent(100);
        setStatusText('HIMALAYAN REGION READY');
        setTimeout(() => {
          setIsHidden(true);
          setTimeout(() => {
            setIsRemoved(true);
            onComplete?.();
          }, 950);
        }, 350);
      }, remainingDelay);
    };

    if (isMapReady) {
      finish();
    } else {
      // Fallback timeout after 4.5s
      const fallback = setTimeout(finish, 4500);
      return () => {
        clearInterval(interval);
        clearTimeout(fallback);
      };
    }

    return () => {
      clearInterval(interval);
    };
  }, [isMapReady, onComplete]);

  if (isRemoved) return null;

  return (
    <div
      id="loader"
      className={`loader ${isHidden ? 'hidden' : ''}`}
      aria-live="polite"
      aria-label="Loading Dovetail Architecture"
    >
      <div className="loader-grid"></div>
      <div className="loader-brand">
        {/* Contour Animation directly above logo */}
        <div className="loader-contour-wrap" aria-hidden="true">
          <svg className="trace" viewBox="0 0 900 260" aria-hidden="true">
            <path d="M12 214 C130 184 98 92 220 108 S340 224 438 165 S525 42 640 94 S752 218 888 55" />
            <path d="M12 228 C130 198 98 106 220 122 S340 238 438 179 S525 56 640 108 S752 232 888 69" />
            <path d="M12 200 C130 170 98 78 220 94 S340 210 438 151 S525 28 640 80 S752 204 888 41" />
            <path d="M20 242 C142 214 102 122 226 136 S350 252 446 191 S532 70 648 120 S762 246 892 84" />
            <path d="M20 186 C138 154 98 66 214 80 S330 196 428 139 S516 16 632 68 S742 190 884 26" />
            <path d="M30 170 C142 140 110 52 218 68 S330 180 418 126 S508 4 626 56 S748 174 878 14" />
            <path d="M36 256 C158 224 116 140 238 150 S358 270 454 205 S542 86 660 132 S770 260 896 104" />
          </svg>
        </div>

        {/* Dovetail Logo */}
        <div className="loader-logo-wrap">
          <img src="/logo.png" alt="Dovetail Architecture" className="loader-logo" />
        </div>

        {/* Loading Progress Bar */}
        <div className="loader-progress-wrap" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
          <div className="loader-progress-track">
            <div className="loader-progress-bar" style={{ width: `${percent}%` }}></div>
          </div>
          <div className="loader-progress-meta">
            <span className="loader-progress-status">{statusText}</span>
            <span className="loader-progress-val">{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
