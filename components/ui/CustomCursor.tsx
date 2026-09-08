'use client';

import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on non-touch fine pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let isVisible = false;

    const updatePosition = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      if (!isVisible) {
        cursor.classList.add('is-visible');
        isVisible = true;
      }
    };

    const handleMouseEnter = () => {
      cursor.classList.add('is-visible');
      isVisible = true;
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('is-visible', 'is-hovering-link', 'is-hovering-pin', 'is-hovering-img');
      isVisible = false;
    };

    const handleMouseDown = () => {
      cursor.classList.add('is-clicking');
    };

    const handleMouseUp = () => {
      cursor.classList.remove('is-clicking');
    };

    // Hover states on interactive elements for subtle cursor feedback
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Map pins & clusters
      if (target.closest('.map-pin') || target.closest('.map-cluster-pin')) {
        cursor.classList.add('is-hovering-pin');
        cursor.classList.remove('is-hovering-link', 'is-hovering-img');
        return;
      }

      // Photos / gallery items / drawings / thumbnails
      if (
        target.closest('.kkaa-photo-item') ||
        target.closest('.kkaa-hero-image-wrap') ||
        target.closest('.panel-photo-thumb') ||
        target.closest('.panel-hero') ||
        target.closest('.panel-drawing-thumb') ||
        target.closest('.panel-drawings-band')
      ) {
        cursor.classList.add('is-hovering-img');
        cursor.classList.remove('is-hovering-pin', 'is-hovering-link');
        return;
      }

      // Project cards, links, buttons, toggles, controls, inputs, nav
      if (
        target.closest('.project-card-kkaa') ||
        target.closest('.related-card') ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.legend-item') ||
        target.closest('[role="button"]') ||
        target.closest('label') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('.map-control-toggle') ||
        target.closest('.map-control-btn') ||
        target.closest('.panel-close-btn') ||
        target.closest('.nav-link') ||
        target.closest('.filter-btn') ||
        target.closest('.map-discipline') ||
        target.closest('.panel-hero-actions') ||
        target.closest('.cluster-core')
      ) {
        cursor.classList.add('is-hovering-link');
        cursor.classList.remove('is-hovering-pin', 'is-hovering-img');
        return;
      }

      // Default over normal canvas / background
      cursor.classList.remove('is-hovering-link', 'is-hovering-pin', 'is-hovering-img');
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="interactive-map-cursor"
      id="site-cursor"
      aria-hidden="true"
    >
      <div className="cursor-symbol-wrap">
        <img
          src="/mouseicon.svg"
          alt="Compass Cursor"
          className="cursor-svg-icon"
        />
        <span className="cursor-center-point"></span>
      </div>
    </div>
  );
};
