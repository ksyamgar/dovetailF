'use client';

import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete?: () => void;
  isMapReady?: boolean;
}

const CONTOUR_PATHS = [
  'M12 214 C130 184 98 92 220 108 S340 224 438 165 S525 42 640 94 S752 218 888 55',
  'M12 228 C130 198 98 106 220 122 S340 238 438 179 S525 56 640 108 S752 232 888 69',
  'M12 200 C130 170 98 78 220 94 S340 210 438 151 S525 28 640 80 S752 204 888 41',
  'M20 242 C142 214 102 122 226 136 S350 252 446 191 S532 70 648 120 S762 246 892 84',
  'M20 186 C138 154 98 66 214 80 S330 196 428 139 S516 16 632 68 S742 190 884 26',
  'M30 170 C142 140 110 52 218 68 S330 180 418 126 S508 4 626 56 S748 174 878 14',
  'M36 256 C158 224 116 140 238 150 S358 270 454 205 S542 86 660 132 S770 260 896 104'
];

const PATH_LENGTH = 1200;

// Subtly staggered progress so the contours trace organically across from left to right
const getStrokeOffset = (index: number, pct: number) => {
  const startOffset = index * 1.5;
  const progressRatio = Math.max(0, Math.min(1, (pct - startOffset) / (100 - startOffset)));
  return Math.round(PATH_LENGTH * (1 - progressRatio));
};

export const Preloader: React.FC<LoaderProps> = ({ onComplete, isMapReady }) => {
  const [percent, setPercent] = useState(0);
  const [statusText, setStatusText] = useState('CALIBRATING TERRAIN ELEVATION');
  const [isHidden, setIsHidden] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    let currentPct = 0;
    let targetPct = 25;
    let isDone = false;
    const startTime = Date.now();
    const MIN_DISPLAY_TIME = 2200; // 2.2s for smooth full contour drawing

    const stages = [
      { target: 40, text: 'INITIALIZING REGIONAL MODEL', delay: 200 },
      { target: 65, text: 'CALIBRATING TERRAIN ELEVATION', delay: 650 },
      { target: 85, text: 'MAPPING TOPOGRAPHIC CONTOURS', delay: 1200 },
      { target: 96, text: 'PREPARING HIMALAYAN SITES', delay: 1700 }
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
        currentPct += (targetPct - currentPct) * 0.22 + 0.6;
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
        {/* Dynamic Topographic Contours Acting As Loading Progress Indicator */}
        <div className="loader-contour-wrap">
          <svg className="trace" viewBox="0 0 900 260" aria-hidden="true">
            {/* Background Faint Guide Topography */}
            {CONTOUR_PATHS.map((d, i) => (
              <path key={`guide-${i}`} d={d} className="guide-contour" />
            ))}
            {/* Dynamic Active Contours Tracking Load Progress */}
            {CONTOUR_PATHS.map((d, i) => (
              <path
                key={`progress-${i}`}
                d={d}
                className="progress-contour"
                style={{ strokeDashoffset: `${getStrokeOffset(i, percent)}px` }}
              />
            ))}
          </svg>
        </div>

        {/* Clean Frameless Loading Status Text Below Contour Animation */}
        <div className="loader-contour-status" role="status" aria-live="polite">
          <span className="contour-status-dot" aria-hidden="true"></span>
          <span className="contour-status-text">{statusText}</span>
          <span className="contour-status-sep" aria-hidden="true">·</span>
          <span className="contour-status-pct">{percent}%</span>
        </div>

        {/* Dovetail Logo */}
        <div className="loader-logo-wrap">
          <img src="/logo.png" alt="Dovetail Architecture" className="loader-logo" />
        </div>
      </div>
    </div>
  );
};
