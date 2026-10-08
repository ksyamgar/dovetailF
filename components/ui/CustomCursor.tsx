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
    let pendingHoverTarget: HTMLElement | null = null;
    let hoverRafId: number | null = null;
    let lastHoverTarget: HTMLElement | null = null;

    // Direct hardware-accelerated transform update without layout thrashing
    const updatePosition = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

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
      cursor.classList.remove('is-visible', 'is-hovering-link', 'is-hovering-pin', 'is-hovering-img', 'is-on-dark');
      isVisible = false;
      lastHoverTarget = null;
    };

    const handleMouseDown = () => {
      cursor.classList.add('is-clicking');
    };

    const handleMouseUp = () => {
      cursor.classList.remove('is-clicking');
    };

    // Throttled hover detector: runs at most once per display frame and caches last element
    const processHover = () => {
      hoverRafId = null;
      const target = pendingHoverTarget;
      if (!target || target === lastHoverTarget) return;
      lastHoverTarget = target;

      // Dark surface detection: footer, dark CTA buttons, dark drawing thumb, dark cards
      if (
        target.closest(
          'footer, .footer, #contact, .panel-cta-primary, .panel-drawing-thumb, .btn-dark, [data-theme="dark"], .bg-dark, .dark-surface'
        )
      ) {
        cursor.classList.add('is-on-dark');
      } else {
        cursor.classList.remove('is-on-dark');
      }

      // 1. Map pins & clusters
      if (target.closest('.map-pin, .map-cluster-pin, .city-marker')) {
        cursor.classList.add('is-hovering-pin');
        cursor.classList.remove('is-hovering-link', 'is-hovering-img');
        return;
      }

      // 2. Photos / gallery items / drawings / thumbnails
      if (
        target.closest(
          '.kkaa-photo-item, .kkaa-hero-image-wrap, .panel-photo-thumb, .panel-hero, .panel-drawing-thumb, .panel-drawings-band'
        )
      ) {
        cursor.classList.add('is-hovering-img');
        cursor.classList.remove('is-hovering-pin', 'is-hovering-link');
        return;
      }

      // 3. Project cards, links, buttons, toggles, controls, inputs, nav
      if (
        target.closest(
          'a, button, .project-card-kkaa, .related-card, .legend-item, [role="button"], label, input, select, textarea, .map-control-toggle, .map-control-btn, .panel-close-btn, .nav-link, .filter-btn, .panel-hero-actions, .cluster-badge-pill'
        )
      ) {
        cursor.classList.add('is-hovering-link');
        cursor.classList.remove('is-hovering-pin', 'is-hovering-img');
        return;
      }

      // Default over normal canvas / background
      cursor.classList.remove('is-hovering-link', 'is-hovering-pin', 'is-hovering-img');
    };

    const handleMouseOver = (e: MouseEvent) => {
      pendingHoverTarget = e.target as HTMLElement | null;
      if (!hoverRafId) {
        hoverRafId = requestAnimationFrame(processHover);
      }
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      if (hoverRafId) cancelAnimationFrame(hoverRafId);
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
